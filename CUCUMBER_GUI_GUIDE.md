# Hướng dẫn chạy Cucumber với giao diện (GUI)

## 🎯 Tổng quan
Hướng dẫn này sẽ giúp bạn chạy Cucumber tests với giao diện browser để có thể quan sát quá trình test trực tiếp.

## 🚀 Các cách chạy Cucumber với GUI

### 1. Chạy tất cả scenarios với GUI
```bash
npm run test:cucumber:gui
```

### 2. Chạy một scenario cụ thể với GUI
```bash
npm run test:cucumber:headed
```
*Lưu ý: Hiện tại đang chạy scenario @SP007 (Submit form with all valid data)*

### 3. Chạy với output chi tiết
```bash
npm run test:cucumber:all
```

### 4. Chạy scenario theo tag cụ thể
```bash
# Chạy tất cả scenarios có tag @happy-path
npx cucumber-js --tags "@happy-path"

# Chạy tất cả scenarios có tag @validation
npx cucumber-js --tags "@validation"

# Chạy tất cả scenarios có tag @layout
npx cucumber-js --tags "@layout"
```

### 5. Chạy scenario theo tên
```bash
# Chạy scenario có tên chứa "Submit form"
npx cucumber-js --name "Submit form"
```

## 📋 Danh sách các tags có sẵn

### Tags theo loại test:
- `@SP001` đến `@SP033`: Các test case cụ thể
- `@layout`: Test layout và alignment
- `@validation`: Test validation
- `@mandatory`: Test các trường bắt buộc
- `@responsive`: Test responsive design
- `@navigation`: Test navigation
- `@happy-path`: Test happy path
- `@boundary`: Test boundary values
- `@email`: Test email validation
- `@phone`: Test phone validation
- `@security`: Test security

### Ví dụ chạy theo nhóm:
```bash
# Chạy tất cả test validation
npx cucumber-js --tags "@validation"

# Chạy test layout và responsive
npx cucumber-js --tags "@layout or @responsive"

# Chạy test security và validation
npx cucumber-js --tags "@security or @validation"

# Loại trừ test security
npx cucumber-js --tags "not @security"
```

## 🖥️ Cấu hình GUI

### Browser sẽ hiển thị với các tùy chọn:
- **Headless: false** - Hiển thị browser window
- **SlowMo: 1000ms** - Làm chậm các action để dễ quan sát
- **Maximized** - Browser mở ở chế độ full screen

### Điều chỉnh tốc độ:
Để thay đổi tốc độ chạy, sửa file `features/step-definitions/support/support-form.steps.js`:

```javascript
browser = await chromium.launch({ 
  headless: false,
  slowMo: 500, // Giảm xuống để chạy nhanh hơn
  args: ['--start-maximized']
});
```

## 📊 Xem kết quả

### 1. Console Output
Kết quả sẽ hiển thị trong console với format:
```
....F.....
1 scenario (1 failed)
9 steps (8 passed, 1 failed)
```

### 2. HTML Report
Sau khi chạy xong, mở file `results/cucumber-report.html` trong browser để xem báo cáo chi tiết.

### 3. Screenshots
Các screenshot sẽ được lưu trong thư mục `results/screenshots/` nếu có lỗi.

## 🔧 Troubleshooting

### Lỗi thường gặp:

1. **Browser không mở:**
   - Kiểm tra xem có process browser nào đang chạy không
   - Restart terminal

2. **Test chạy quá chậm:**
   - Giảm `slowMo` trong file steps
   - Chạy với tag cụ thể thay vì tất cả

3. **Lỗi timeout:**
   - Tăng timeout trong `cucumber.config.js`
   - Kiểm tra kết nối mạng

### Debug mode:
```bash
# Chạy với debug info
DEBUG=* npx cucumber-js --tags "@SP007"
```

## 📝 Tips và Tricks

1. **Chạy một scenario để test nhanh:**
   ```bash
   npx cucumber-js --tags "@SP007"
   ```

2. **Pause test để debug:**
   Thêm `await this.page.pause();` vào step definition

3. **Chụp screenshot:**
   ```javascript
   await this.page.screenshot({ path: "debug.png" });
   ```

4. **Xem console logs:**
   ```javascript
   this.page.on('console', msg => console.log(msg.text()));
   ```

## 🎯 Ví dụ thực tế

### Chạy test form submission:
```bash
npm run test:cucumber:headed
```

### Chạy test validation:
```bash
npx cucumber-js --tags "@validation"
```

### Chạy test responsive:
```bash
npx cucumber-js --tags "@responsive"
```

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Node.js version (>= 14)
2. Dependencies đã được cài đặt: `npm install`
3. Browser (Chrome) đã được cài đặt
4. Kết nối mạng ổn định 