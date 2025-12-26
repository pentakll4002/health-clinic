<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Phòng khám Mạch Tư - Xác thực OTP</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f7fa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                
                <!-- Main Container -->
                <table width="100%" maxwidth="600" cellpadding="0" cellspacing="0"
                    style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); overflow: hidden;">

                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #007b8f 0%, #005f6a 100%); padding: 40px 20px; text-align: center;">
                            <div style="font-size: 26px; font-weight: bold; color: #ffffff; margin-bottom: 8px;">
                                🩺 Phòng khám Mạch Tư
                            </div>
                            <p style="color: rgba(255,255,255,0.9); font-size: 13px; margin: 0; letter-spacing: 1px;">
                                HỆ THỐNG QUẢN LÝ PHÒNG KHÁM – UIT
                            </p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            
                            <p style="font-size: 18px; color: #1a1a1a; font-weight: 600; margin: 0 0 20px 0;">
                                Xin chào bạn,
                            </p>

                            <p style="font-size: 16px; color: #555555; line-height: 1.6; margin: 0 0 20px 0;">
                                Cảm ơn bạn đã quan tâm và sử dụng <strong>Hệ thống quản lý Phòng khám Mạch Tư</strong>
                                – sản phẩm đồ án học phần của nhóm sinh viên UIT.
                            </p>

                            <p style="font-size: 16px; color: #555555; line-height: 1.6; margin: 0 0 30px 0;">
                                Bạn đã yêu cầu đăng ký tài khoản người dùng. Để hoàn tất quá trình xác thực,
                                vui lòng sử dụng mã OTP bên dưới:
                            </p>

                            <!-- OTP -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0;">
                                <tr>
                                    <td align="center">
                                        <div style="
                                            background: linear-gradient(135deg, #eefafd 0%, #dff4f7 100%);
                                            border: 2px dashed #007b8f;
                                            padding: 35px 30px;
                                            border-radius: 10px;
                                            text-align: center;
                                        ">
                                            <p style="
                                                font-size: 13px;
                                                color: #007b8f;
                                                font-weight: 600;
                                                margin: 0 0 12px 0;
                                                text-transform: uppercase;
                                                letter-spacing: 2px;
                                            ">
                                                Mã xác thực OTP
                                            </p>
                                            <p style="
                                                font-size: 40px;
                                                font-weight: 700;
                                                color: #005f6a;
                                                margin: 0;
                                                letter-spacing: 8px;
                                                font-family: 'Courier New', monospace;
                                            ">
                                                {{ $otp }}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Notes -->
                            <table width="100%" cellpadding="0" cellspacing="0"
                                style="margin: 30px 0; background-color: #fff9e6; border-left: 4px solid #ffc107; padding: 15px;">
                                <tr>
                                    <td style="padding: 0 15px;">
                                        <p style="font-size: 14px; color: #856404; margin: 0; font-weight: 600;">
                                            ⚠️ Lưu ý:
                                        </p>
                                        <ul style="font-size: 14px; color: #856404; margin: 8px 0 0 0; padding-left: 20px;">
                                            <li>Mã OTP có hiệu lực trong <strong>10 phút</strong></li>
                                            <li>Không chia sẻ mã xác thực cho người khác</li>
                                            <li>Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email</li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>

                            <!-- Support -->
                            <p style="font-size: 14px; color: #777777; line-height: 1.6; margin: 30px 0 0 0;">
                                Đây là hệ thống phục vụ mục đích học tập.
                                <br>
                                Mọi thắc mắc vui lòng liên hệ nhóm phát triển – <strong>UIT</strong>.
                            </p>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="height: 1px; background-color: #e0e0e0;"></td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 25px 30px; background-color: #f9f9f9;">
                            <p style="font-size: 12px; color: #999999; margin: 0 0 10px 0; text-align: center;">
                                Email được gửi tự động từ hệ thống – vui lòng không phản hồi.
                            </p>
                            <p style="font-size: 11px; color: #cccccc; margin: 0; text-align: center;">
                                © 2025 Phòng khám Mạch Tư – UIT (Đồ án môn học)
                            </p>
                            <p style="font-size: 11px; color: #cccccc; margin: 8px 0 0 0; text-align: center;">
                                Thời gian gửi: {{ \Carbon\Carbon::now('Asia/Ho_Chi_Minh')->format('H:i d/m/Y') }}
                            </p>
                        </td>
                    </tr>

                    <!-- Trust -->
                    <tr>
                        <td style="padding: 20px 30px; text-align: center; background-color: #fafafa; border-top: 1px solid #f0f0f0;">
                            <p style="font-size: 12px; color: #999999; margin: 0;">
                                🔐 Dữ liệu chỉ phục vụ mục đích học tập và nghiên cứu
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
