<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Health Clinic - Xác thực OTP</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f7fa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <!-- Main Container -->
                <table width="100%" maxwidth="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); overflow: hidden;">
                    
                    <!-- Header Section -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%); padding: 40px 20px; text-align: center;">
                            <div style="font-size: 28px; font-weight: bold; color: #ffffff; margin-bottom: 10px;">
                                🏥 Health Clinic
                            </div>
                            <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 0; letter-spacing: 1px;">
                                BỆNH VIỆN SỨC KHỎE TỒN TẠI
                            </p>
                        </td>
                    </tr>

                    <!-- Content Section -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <!-- Greeting -->
                            <p style="font-size: 18px; color: #1a1a1a; font-weight: 600; margin: 0 0 20px 0;">
                                Xin chào bạn,
                            </p>

                            <!-- Message -->
                            <p style="font-size: 16px; color: #555555; line-height: 1.6; margin: 0 0 25px 0;">
                                Chúng tôi rất vui mừng đón tiếp bạn tại <strong>Health Clinic</strong> - hệ thống quản lý bệnh viện hiện đại và chuyên nghiệp.
                            </p>

                            <p style="font-size: 16px; color: #555555; line-height: 1.6; margin: 0 0 30px 0;">
                                Bạn đã yêu cầu đăng ký tài khoản bệnh nhân. Để hoàn thành quá trình đăng ký và bảo vệ tài khoản của bạn, vui lòng sử dụng mã xác thực dưới đây:
                            </p>

                            <!-- OTP Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0;">
                                <tr>
                                    <td align="center">
                                        <div style="
                                            background: linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%);
                                            border: 2px dashed #0066cc;
                                            padding: 35px 30px;
                                            border-radius: 10px;
                                            text-align: center;
                                        ">
                                            <p style="
                                                font-size: 14px;
                                                color: #0066cc;
                                                font-weight: 500;
                                                margin: 0 0 15px 0;
                                                text-transform: uppercase;
                                                letter-spacing: 2px;
                                            ">
                                                Mã xác thực OTP
                                            </p>
                                            <p style="
                                                font-size: 42px;
                                                font-weight: 700;
                                                color: #0052a3;
                                                margin: 0;
                                                letter-spacing: 8px;
                                                font-family: 'Courier New', monospace;
                                                word-spacing: 10px;
                                            ">
                                                {{ $otp }}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Important Notes -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; background-color: #fff9e6; border-left: 4px solid #ffc107; padding: 15px;">
                                <tr>
                                    <td style="padding: 0 15px;">
                                        <p style="font-size: 14px; color: #856404; margin: 0; font-weight: 500;">
                                            ⚠️ <strong>Lưu ý quan trọng:</strong>
                                        </p>
                                        <ul style="font-size: 14px; color: #856404; margin: 8px 0 0 0; padding-left: 20px;">
                                            <li style="margin-bottom: 5px;">Mã OTP sẽ hết hiệu lực sau <strong>10 phút</strong></li>
                                            <li style="margin-bottom: 5px;">Không chia sẻ mã này cho bất kỳ ai khác</li>
                                            <li>Nếu bạn không yêu cầu đăng ký, vui lòng bỏ qua email này</li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>

                            <!-- Support Info -->
                            <p style="font-size: 14px; color: #777777; line-height: 1.6; margin: 30px 0 0 0;">
                                Nếu bạn gặp bất kỳ vấn đề nào khi đăng ký, vui lòng liên hệ với đội hỗ trợ của chúng tôi:
                                <br><strong style="color: #0066cc;">support@healthclinic.com</strong> hoặc gọi <strong>1900-xxxx</strong>
                            </p>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="height: 1px; background-color: #e0e0e0;"></td>
                    </tr>

                    <!-- Footer Section -->
                    <tr>
                        <td style="padding: 25px 30px; background-color: #f9f9f9;">
                            <p style="font-size: 12px; color: #999999; margin: 0 0 10px 0; text-align: center;">
                                Đây là email tự động. Vui lòng không trả lời email này.
                            </p>
                            <p style="font-size: 11px; color: #cccccc; margin: 0; text-align: center;">
                                © 2025 Health Clinic. Tất cả các quyền được bảo lưu.
                            </p>
                            <p style="font-size: 11px; color: #cccccc; margin: 8px 0 0 0; text-align: center;">
                                Được gửi vào {{ \Carbon\Carbon::now('Asia/Ho_Chi_Minh')->format('H:i d/m/Y') }}
                            </p>
                        </td>
                    </tr>

                    <!-- Trust Badge -->
                    <tr>
                        <td style="padding: 20px 30px; text-align: center; background-color: #fafafa; border-top: 1px solid #f0f0f0;">
                            <p style="font-size: 12px; color: #999999; margin: 0;">
                                🔒 Thông tin của bạn được bảo mật và mã hóa
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
