# Hướng Dẫn Ingest Dữ Liệu Roles vào Chatbot

## Tổng Quan

File này mô tả cách ingest dữ liệu về roles và permissions từ Laravel backend vào Python chatbot để chatbot có thể trả lời các câu hỏi về phân quyền trong hệ thống.

## Dữ Liệu Đã Được Trích Xuất

Dữ liệu roles đã được trích xuất từ:
- **Models**: `NhomNguoiDung`, `PhanQuyen`, `ChucNang`
- **Seeders**: `NhomNguoiDungSeeder`, `PhanQuyenSeeder`, `ChucNangSeeder`
- **Migrations**: Cấu trúc database của các bảng liên quan
- **Controllers**: Cách roles được sử dụng trong các API endpoints
- **Helpers**: `RoleHelper` với các helper methods

## File Dữ Liệu

File dữ liệu được lưu tại: `python-chatbot/data/raw/roles_and_permissions.md`

File này chứa:
- Danh sách 5 roles: @admin, @doctors, @receptionists, @managers, @patient
- Danh sách 24 chức năng/permissions
- Bảng phân quyền chi tiết
- Cấu trúc database
- Helper methods
- API endpoints theo từng role
- Ví dụ sử dụng trong controllers

## Cách Ingest Dữ Liệu

### Cách 1: Fetch từ Laravel API (Khuyến nghị)

Script này sẽ tự động kết nối tới Laravel backend API để lấy dữ liệu roles mới nhất:

```bash
cd python-chatbot

# Cấu hình trong .env hoặc environment variables
export LARAVEL_API_URL=http://localhost:8000
export LARAVEL_API_TOKEN=your_token_if_needed  # Optional

# Chạy script
python ingestion/fetch_roles_from_api.py
```

**Lưu ý**: 
- Endpoint `/api/roles-data` là public endpoint, không cần authentication
- Nếu endpoint này không khả dụng, script sẽ tự động fallback về các endpoint riêng lẻ (cần authentication)

### Cách 2: Sử dụng File Markdown Tĩnh

Nếu bạn đã có file markdown sẵn:

```bash
cd python-chatbot
python ingestion/ingest_roles.py
```

### Cách 3: Ingest Thủ Công

```python
from ingestion.ingest import DocumentIngester

ingester = DocumentIngester()
result = ingester.ingest_file(
    "data/raw/roles_and_permissions.md",
    metadata={
        "type": "roles_permissions",
        "source": "laravel_backend",
        "category": "system_documentation"
    }
)
```

## Kiểm Tra Kết Quả

Sau khi ingest, bạn có thể test chatbot với các câu hỏi như:
- "Các roles trong hệ thống là gì?"
- "Bác sĩ có những quyền gì?"
- "Ai có thể quản lý thuốc?"
- "Lễ tân có thể làm gì?"
- "API endpoints nào dành cho quản lý?"

## Cập Nhật Dữ Liệu

### Tự động từ API (Khuyến nghị)

Chỉ cần chạy lại script fetch từ API:

```bash
python ingestion/fetch_roles_from_api.py
```

Script sẽ tự động lấy dữ liệu mới nhất từ Laravel backend và ingest vào vector store.

### Từ File Markdown

Nếu có thay đổi về roles trong Laravel backend và bạn muốn cập nhật từ file:
1. Cập nhật file `data/raw/roles_and_permissions.md`
2. Chạy lại script ingest: `python ingestion/ingest_roles.py`

## Lưu Ý

- Dữ liệu roles được ingest vào vector store, chatbot sẽ tự động tìm kiếm và trả lời dựa trên ngữ cảnh.
- Metadata được gắn với type "roles_permissions" để dễ dàng filter nếu cần.
- File markdown được format để dễ đọc và dễ chunking.

