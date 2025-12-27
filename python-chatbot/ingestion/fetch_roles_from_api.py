"""
Script to fetch roles and permissions data from Laravel backend API
and ingest into the vector store
"""
import os
import sys
import requests
import json
from typing import Dict, List, Optional

# Add parent directory to path
script_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(script_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from ingestion.ingest import DocumentIngester
from langchain_core.documents import Document


class LaravelAPIClient:
    """Client to fetch data from Laravel backend API"""
    
    def __init__(self, base_url: str, token: Optional[str] = None):
        self.base_url = base_url.rstrip('/')
        self.token = token
        self.session = requests.Session()
        if token:
            self.session.headers.update({
                'Authorization': f'Bearer {token}',
                'Accept': 'application/json'
            })
        else:
            self.session.headers.update({
                'Accept': 'application/json'
            })
    
    def get(self, endpoint: str) -> Dict:
        """Make GET request to API"""
        # Remove leading slash from endpoint
        endpoint = endpoint.lstrip('/')
        # Remove 'api/' prefix if present in endpoint
        if endpoint.startswith('api/'):
            endpoint = endpoint[4:]
        
        # Build URL: if base_url ends with /api, use it directly, otherwise add /api
        base = self.base_url.rstrip('/')
        if base.endswith('/api'):
            url = f"{base}/{endpoint}"
        else:
            url = f"{base}/api/{endpoint}"
        
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching {endpoint}: {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"Response: {e.response.text}")
            raise
    
    def fetch_roles_data(self) -> Dict:
        """Fetch all roles data from dedicated endpoint"""
        try:
            data = self.get('roles-data')
            return data if isinstance(data, dict) else {}
        except Exception as e:
            print(f"Warning: Could not fetch roles data from roles-data endpoint: {e}")
            # Fallback to individual endpoints
            return self._fetch_individual_endpoints()
    
    def _fetch_individual_endpoints(self) -> Dict:
        """Fallback: fetch from individual endpoints"""
        result = {
            'roles': [],
            'functions': [],
            'permissions': [],
        }
        
        try:
            result['roles'] = self.get('nhom-nguoi-dung')
            if not isinstance(result['roles'], list):
                result['roles'] = []
        except Exception as e:
            print(f"Warning: Could not fetch roles: {e}")
        
        try:
            result['functions'] = self.get('chuc-nang')
            if not isinstance(result['functions'], list):
                result['functions'] = []
        except Exception as e:
            print(f"Warning: Could not fetch functions: {e}")
        
        try:
            result['permissions'] = self.get('phan-quyen')
            if not isinstance(result['permissions'], list):
                result['permissions'] = []
        except Exception as e:
            print(f"Warning: Could not fetch permissions: {e}")
        
        return result
    
    def fetch_api_catalog(self) -> Dict:
        """Fetch API catalog with role-based endpoints"""
        try:
            data = self.get('api-catalog')
            return data if isinstance(data, dict) else {}
        except Exception as e:
            print(f"Warning: Could not fetch API catalog (may need authentication): {e}")
            return {}


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


def fetch_and_ingest_roles(api_base_url: str, token: Optional[str] = None):
    """Fetch roles data from API and ingest into vector store"""
    print("=" * 60)
    print("Fetching Roles and Permissions from Laravel API")
    print("=" * 60)
    
    # Initialize API client
    client = LaravelAPIClient(api_base_url, token)
    
    print("Fetching data from API...")
    
    # Try to fetch from dedicated endpoint first
    roles_data = client.fetch_roles_data()
    
    if roles_data and 'roles' in roles_data:
        roles = roles_data.get('roles', [])
        functions = roles_data.get('functions', [])
        permissions = roles_data.get('permissions', [])
    else:
        # Fallback to individual endpoints
        roles = []
        functions = []
        permissions = []
    
    # Fetch API catalog separately
    api_catalog = client.fetch_api_catalog()
    
    print(f"[OK] Fetched data:")
    print(f"   - Roles: {len(roles)}")
    print(f"   - Functions: {len(functions)}")
    print(f"   - Permissions: {len(permissions)}")
    print(f"   - API Catalog: {'Yes' if api_catalog else 'No'}")
    
    if not roles and not functions:
        print("[WARNING] No data fetched. Check API URL and authentication.")
        return
    
    # Format data
    print("\nFormatting data...")
    markdown_content = format_roles_data(roles, functions, permissions, api_catalog)
    
    # Save to file (optional)
    output_file = os.path.join(script_dir, "..", "data", "raw", "roles_from_api.md")
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(markdown_content)
    print(f"[OK] Saved formatted data to: {output_file}")
    
    # Ingest into vector store
    print("\nIngesting into vector store...")
    ingester = DocumentIngester()
    
    try:
        result = ingester.ingest_text(
            markdown_content,
            metadata={
                "type": "roles_permissions",
                "source": "laravel_backend_api",
                "category": "system_documentation"
            }
        )
        
        print(f"[OK] Successfully ingested roles data!")
        print(f"   - Number of chunks: {result['num_chunks']}")
        print("=" * 60)
        
    except Exception as e:
        print(f"[ERROR] Error ingesting roles data: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    import os
    from dotenv import load_dotenv
    
    load_dotenv()
    
    # Get API configuration from environment or use defaults
    api_base_url = os.getenv("LARAVEL_API_URL", "http://localhost:8000")
    api_token = os.getenv("LARAVEL_API_TOKEN", None)
    
    fetch_and_ingest_roles(api_base_url, api_token)

