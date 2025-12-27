"""
Script to format and ingest roles and permissions data from local markdown file
into the vector store
"""
import os
import sys
import json
from typing import Dict, List, Optional

# Add parent directory to path
script_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(script_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from ingestion.ingest import DocumentIngester


def format_roles_data(roles: List[Dict], functions: List[Dict], 
                     permissions: List[Dict], api_catalog: Dict) -> str:
    """Format roles data into markdown document"""
    
    content = ["# Hệ Thống Phân Quyền - Health Clinic Management System\n"]
    content.append("## Tổng Quan\n")
    content.append("Hệ thống quản lý phòng khám sử dụng hệ thống phân quyền dựa trên nhóm người dùng và chức năng. "
                  "Mỗi nhóm người dùng (role) có các quyền truy cập vào các chức năng cụ thể trong hệ thống.\n")
    
    # Map functions by ID for quick lookup
    functions_map = {f.get('ID_ChucNang'): f for f in functions}
    
    # Group permissions by role
    permissions_by_role = {}
    for perm in permissions:
        nhom = perm.get('nhom_nguoi_dung', {})
        chuc_nang = perm.get('chuc_nang', {})
        role_id = nhom.get('ID_Nhom')
        func_id = chuc_nang.get('ID_ChucNang')
        
        if role_id and func_id:
            if role_id not in permissions_by_role:
                permissions_by_role[role_id] = {
                    'role': nhom,
                    'functions': []
                }
            permissions_by_role[role_id]['functions'].append(chuc_nang)
    
    # Format roles section
    content.append("## Các Nhóm Người Dùng (Roles)\n")
    
    for role in roles:
        role_id = role.get('ID_Nhom')
        ma_nhom = role.get('MaNhom', '')
        ten_nhom = role.get('TenNhom', '')
        role_code = f"@{ma_nhom}" if not ma_nhom.startswith('@') else ma_nhom
        
        content.append(f"### {role.get('ID_Nhom', '')}. {ten_nhom} ({role_code})\n")
        content.append(f"- **Mã nhóm**: {ma_nhom}\n")
        content.append(f"- **Mô tả**: ")
        
        # Get permissions for this role
        if role_id in permissions_by_role:
            funcs = permissions_by_role[role_id]['functions']
            content.append(f"Có quyền truy cập {len(funcs)} chức năng\n")
            content.append("- **Quyền**:\n")
            for func in funcs:
                func_name = func.get('TenChucNang', '')
                func_code = func.get('TenManHinhTuongUong', '')
                content.append(f"  - {func_name} ({func_code})\n")
        else:
            if role_code == '@admin':
                content.append("Có toàn quyền truy cập tất cả các chức năng trong hệ thống\n")
                content.append("- **Quyền**: Tất cả các chức năng\n")
            else:
                content.append("Chưa được gán quyền\n")
        
        content.append("\n")
    
    # Format functions section
    content.append("## Danh Sách Chức Năng (Functions/Permissions)\n")
    for func in functions:
        func_id = func.get('ID_ChucNang')
        func_name = func.get('TenChucNang', '')
        func_code = func.get('TenManHinhTuongUong', '')
        content.append(f"### {func_id}. {func_name} ({func_code})\n")
        content.append(f"- **Màn hình tương ứng**: {func_code}\n")
        content.append(f"- **Mô tả**: Chức năng {func_name}\n\n")
    
    # Format API catalog if available
    if api_catalog:
        content.append("## API Endpoints theo Role\n")
        if 'roles' in api_catalog:
            content.append("### Mô tả Roles\n")
            for role_code, role_info in api_catalog['roles'].items():
                desc = role_info.get('description', '')
                content.append(f"- **{role_code}**: {desc}\n")
            content.append("\n")
        
        if 'endpoints' in api_catalog:
            for role_code, endpoints in api_catalog['endpoints'].items():
                content.append(f"### {role_code}\n")
                for endpoint in endpoints:
                    method = endpoint.get('method', 'GET')
                    path = endpoint.get('path', '')
                    purpose = endpoint.get('purpose', '')
                    content.append(f"- {method} {path} - {purpose}\n")
                content.append("\n")
    
    # Format permissions matrix
    content.append("## Bảng Phân Quyền Chi Tiết\n")
    content.append("| Chức năng | " + " | ".join([f"@{r.get('MaNhom', '')}" for r in roles]) + " |\n")
    content.append("|-----------|" + "|".join(["---" for _ in roles]) + "|\n")
    
    for func in functions:
        func_name = func.get('TenChucNang', '')
        func_id = func.get('ID_ChucNang')
        row = [func_name]
        
        for role in roles:
            role_id = role.get('ID_Nhom')
            has_permission = False
            if role_id in permissions_by_role:
                func_ids = [f.get('ID_ChucNang') for f in permissions_by_role[role_id]['functions']]
                has_permission = func_id in func_ids
            
            # Admin always has all permissions
            ma_nhom = role.get('MaNhom', '')
            if ma_nhom == 'admin':
                has_permission = True
            
            row.append("[YES]" if has_permission else "[NO]")
        
        content.append("| " + " | ".join(row) + " |\n")
    
    content.append("\n## Lưu Ý\n")
    content.append("- Role \"patient\" là role đặc biệt dành cho bệnh nhân, có quyền hạn hạn chế hơn so với các role nhân viên.\n")
    content.append("- Role \"admin\" luôn có quyền truy cập tất cả, không cần kiểm tra trong bảng phan_quyen.\n")
    content.append("- Các role khác phải có bản ghi trong bảng phan_quyen để có quyền truy cập chức năng.\n")
    content.append("- Tất cả role codes trong hệ thống sử dụng format @role_name (ví dụ: @admin, @doctors).\n")
    
    return "".join(content)


def ingest_static_roles_data(roles_file_path: str):
    """Ingest static roles data from a markdown file into the vector store"""
    print("=" * 60)
    print("Ingesting Roles and Permissions Data from static file")
    print("=" * 60)
    
    if not os.path.exists(roles_file_path):
        print(f"[ERROR] File not found: {roles_file_path}")
        return
    
    print(f"Loading roles data from: {roles_file_path}")
    
    # Ingest the file
    ingester = DocumentIngester()
    try:
        result = ingester.ingest_file(
            roles_file_path,
            metadata={
                "type": "roles_permissions",
                "source": "static_markdown",
                "category": "system_documentation"
            }
        )
        
        print(f"[OK] Successfully ingested roles data!")
        print(f"   - Number of chunks: {result['num_chunks']}")
        print(f"   - Source: {roles_file_path}")
        print("=" * 60)
        
    except Exception as e:
        print(f"[ERROR] Error ingesting roles data: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    static_roles_file = os.path.join(script_dir, "..", "data", "raw", "roles_and_permissions.md")
    ingest_static_roles_data(static_roles_file)

