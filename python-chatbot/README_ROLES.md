# Hướng Dẫn Ingest Dữ Liệu Roles vào Chatbot

## Tổng Quan

File này mô tả cách ingest dữ liệu về roles và permissions từ một file markdown cục bộ vào Python chatbot để chatbot có thể trả lời các câu hỏi về phân quyền trong hệ thống.

## File Dữ Liệu

File dữ liệu được lưu tại: `python-chatbot/data/raw/roles_and_permissions.md`

File này chứa:
- Danh sách các roles (nhóm người dùng)
- Danh sách các chức năng (permissions)
- Bảng phân quyền chi tiết
- Cấu trúc database liên quan đến phân quyền
- Các helper methods liên quan đến role
- Các API endpoints theo từng role (từ tài liệu trước đó)

## Cách Ingest Dữ Liệu

### Sử dụng Script Python

Script này sẽ đọc file markdown `roles_and_permissions.md` và ingest nội dung vào vector store của chatbot.

```bash
cd python-chatbot
python ingestion/ingest_roles_data.py
```

### Ingest Thủ Công

Nếu bạn muốn ingest thủ công trong mã Python:

```python
from ingestion.ingest import DocumentIngester
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
static_roles_file = os.path.join(script_dir, "..", "data", "raw", "roles_and_permissions.md")

ingester = DocumentIngester()
result = ingester.ingest_file(
    static_roles_file,
    metadata={
        "type": "roles_permissions",
        "source": "static_markdown",
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

Nếu có thay đổi về roles trong hệ thống:
1. Cập nhật file `data/raw/roles_and_permissions.md`
2. Chạy lại script ingest: `python ingestion/ingest_roles_data.py`

## Lưu Ý

- Dữ liệu roles được ingest vào vector store, chatbot sẽ tự động tìm kiếm và trả lời dựa trên ngữ cảnh.
- Metadata được gắn với type "roles_permissions" để dễ dàng filter nếu cần.
- File markdown được format để dễ đọc và dễ chunking.
