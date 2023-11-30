const { getDataFromDatabase } = require("../../controllers/dataController");

// Lấy tham chiếu đến canvas và context
const moistureCanvas = document.getElementById('moistureChart');
const moistureContext = moistureCanvas.getContext('2d');

// Khởi tạo mảng để lưu trữ dữ liệu moisture và thời gian tương ứng
const moistureData = [];
const timeLabels = [];

// Khởi tạo biểu đồ
const chart = new Chart(moistureContext, {
  type: 'line',
  data: {
    labels: timeLabels, // Label thời gian
    datasets: [{
      label: 'Moisture Level',
      borderColor: 'rgb(75, 192, 192)',
      data: moistureData,
    }],
  },
  options: {
    scales: {
      x: [{
        type: 'linear',
        position: 'bottom',
      }],
    },
  },
});

// Hàm cập nhật biểu đồ với dữ liệu mới
function updateChart(newMoistureData, newTimeLabel) {
  // Thêm dữ liệu mới vào mảng
  moistureData.push(newMoistureData);
  timeLabels.push(newTimeLabel);

  // Giới hạn số lượng điểm trên biểu đồ (ví dụ: giữ lại 20 điểm gần nhất)
  if (moistureData.length > 20) {
    moistureData.shift();
    timeLabels.shift();
  }

  // Cập nhật biểu đồ
  chart.update();
}

setInterval(()=>{
  getDataFromDatabase();
}, 5000);
