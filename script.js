const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const segments = ["Minyak", "Beras", "Diskon 5%", "Zonk", "Voucher 10rb", "Zonk", "Piring", "Mangkok"];
const colors = ["#f68b1f", "#fdb913", "#f68b1f", "#fdb913", "#f68b1f", "#fdb913", "#f68b1f", "#fdb913"];
const segAngle = 360 / segments.length;

let currentRotation = 0;
let isSpinning = false;

function drawWheel(rotation) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < segments.length; i++) {
    const start = ((i * segAngle - 90 + rotation) * Math.PI) / 180;
    const end = (((i + 1) * segAngle - 90 + rotation) * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(250, 250);
    ctx.arc(250, 250, 200, start, end);
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate(((i + 0.5) * segAngle - 90 + rotation) * Math.PI / 180);
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(segments[i], 100, 0);
    ctx.restore();
  }
}


function spinWheel() {
  if (isSpinning) return;
  isSpinning = true;

  const extraAngle = Math.random() * 360; // Biarkan desimal agar lebih halus
  const totalRotation = 360 * (4 + Math.random() * 2) + extraAngle;
  // Antara 4–6 putaran (acak), plus sudut acak
  const duration = 5000;
  const start = Date.now();

  const animate = () => {
    const now = Date.now();
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    currentRotation = totalRotation * easeOut;

    drawWheel(currentRotation);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      isSpinning = false;

      const finalAngle = (currentRotation % 360 + 360) % 360;
      const selectedIndex = segments.length - 1 - Math.floor((finalAngle / segAngle)) % segments.length;
      const hadiah = segments[selectedIndex];
        if (hadiah.toLowerCase() === "zonk") {
            document.getElementById("prizeText").innerText = "❌ Maaf, kamu belum beruntung. Coba lagi ya!";
        } else {
            document.getElementById("prizeText").innerText = "🎉 Selamat! Kamu mendapatkan: " + hadiah + " 🎁";
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
        }
document.getElementById("winModal").style.display = "block";
    }
  };

  animate();
}

document.getElementById("spin").addEventListener("click", spinWheel);
drawWheel(0);
