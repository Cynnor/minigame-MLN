import { useState } from "react";

const board = [
  { id: 1, label: "🚀 Khởi nghiệp" },
  { id: 2, label: "Ô 2" },
  {
    id: 3,
    label: "Thiếu vốn 💸",
    rule: "Mâu thuẫn: Thiếu vốn để phát triển → cần hợp tác/gọi vốn.",
  },
  { id: 4, label: "Ô 4" },
  {
    id: 5,
    label: "Tích lũy 📚",
    rule: "Quy luật Lượng - Chất: Kinh nghiệm tích lũy đủ nhiều sẽ tạo bước nhảy.",
  },
  { id: 6, label: "Ô 6" },
  {
    id: 7,
    label: "Thất bại ❌",
    rule: "Phủ định lần 1: Thất bại không xóa bỏ tất cả mà để lại bài học.",
  },
  { id: 8, label: "Ô 8" },
  {
    id: 9,
    label: "Tái khởi nghiệp 🔄",
    rule: "Phủ định của phủ định: Vượt qua thất bại để đạt trình độ cao hơn.",
  },
  { id: 10, label: "Ô 10" },
  { id: 11, label: "Ô 11" },
  {
    id: 12,
    label: "Thành công 🌟",
    rule: "Thành công: Kết quả tất yếu sau quá trình vượt mâu thuẫn, tích lũy, phủ định.",
  },
];

export default function App() {
  const [position, setPosition] = useState(1);
  const [message, setMessage] = useState(null);
  const [lastRoll, setLastRoll] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [diceAngle, setDiceAngle] = useState(0); // góc xoay xúc xắc
  const [chatGptResult, setChatGptResult] = useState(null);
  const [chatGptLoading, setChatGptLoading] = useState(false);
  const [diceClass, setDiceClass] = useState(""); // hiệu ứng xúc xắc

  const rollDice = () => {
    if (position >= 12 || isRolling) return;
    setIsRolling(true);
    setDiceClass("rolling"); // thêm class hiệu ứng
    setDiceAngle((a) => a + 540 + Math.floor(Math.random() * 360)); // xoay ngẫu nhiên hơn
    // Chỉ random ra 1, 2, 3
    const dice = Math.floor(Math.random() * 3) + 1;
    setLastRoll(dice);

    let newPos = position + dice;
    if (newPos > 12) newPos = 12;

    setTimeout(() => {
      setPosition(newPos);
      setChatGptResult(null); // Ẩn kết quả ChatGPT khi đến vị trí mới
      const currentSquare = board.find((sq) => sq.id === newPos);
      if (currentSquare && currentSquare.rule) {
        setMessage(currentSquare.rule);
      } else {
        setMessage(null);
      }
      setIsRolling(false);
      setDiceClass("shake"); // hiệu ứng lắc khi dừng
      setTimeout(() => setDiceClass(""), 500); // xóa hiệu ứng lắc sau 0.5s
    }, 600); // khớp thời gian xoay
  };

  const resetGame = () => {
    setPosition(1);
    setMessage(null);
    setLastRoll(null);
    setIsRolling(false);
    setDiceAngle(0);
    setChatGptResult(null); // Ẩn kết quả ChatGPT khi chơi lại
  };

  // Định nghĩa mẫu cho các ô đặc biệt (có thể sửa lại nội dung cho sáng tạo hơn)
  const MOCK_DEFINITIONS = {
    3: "Mâu thuẫn biện chứng là sự thống nhất và đấu tranh giữa các mặt đối lập trong một sự vật, hiện tượng; nó là nguồn gốc, động lực của sự vận động và phát triển.",
    5: "Quy luật chuyển hóa từ những thay đổi về lượng thành những thay đổi về chất và ngược lại, thông qua bước nhảy, chỉ ra cách thức phổ biến của sự vận động và phát triển.",
    7: "Phủ định biện chứng là sự phủ định mang tính khách quan, có tính kế thừa và phát triển; cái mới ra đời thay thế cái cũ nhưng đồng thời giữ lại những yếu tố tích cực.",
    9: "Quy luật phủ định của phủ định khái quát khuynh hướng tất yếu của sự phát triển, là quá trình đi lên theo hình thức xoáy ốc, trong đó cái mới ra đời phủ định cái cũ, nhưng đồng thời kế thừa và phát triển.",
    12: "Thành công là kết quả tất yếu của quá trình giải quyết mâu thuẫn, tích lũy lượng đến điểm nút, thực hiện phủ định biện chứng và phủ định của phủ định, tạo nên bước phát triển mới.",
  };

  // Nguồn trích xuất cho các ô đặc biệt
  const MOCK_SOURCES = {
    3: "Nguồn: Giáo trình Triết học Mác – Lênin, Bộ Giáo dục và Đào tạo, NXB Chính trị Quốc gia Sự Thật, 2021, Chương III, mục 2.2.",
    5: "Nguồn: Giáo trình Triết học Mác – Lênin, Bộ GD&ĐT, NXB CTQG Sự Thật, 2021, Chương II, mục 2.2",
    7: "Nguồn: Giáo trình Triết học Mác – Lênin, Bộ GD&ĐT, NXB CTQG Sự Thật, 2021, Chương III, mục 3.1.",
    9: "Nguồn: Giáo trình Triết học Mác – Lênin, Bộ GD&ĐT, NXB CTQG Sự Thật, 2021, Chương III, mục 3.2.",
    12: "Nguồn: Giáo trình Triết học Mác – Lênin, Bộ GD&ĐT, NXB CTQG Sự Thật, 2021, các chương II–III.",
  };

  // Hàm mock hỏi ChatGPT
  const askChatGpt = async () => {
    setChatGptLoading(true);
    setChatGptResult(null);
    setTimeout(() => {
      setChatGptResult(MOCK_DEFINITIONS[position] || "Không có dữ liệu mẫu.");
      setChatGptLoading(false);
    }, 900);
  };

  const diceSymbols = { 1: "⚀", 2: "⚁", 3: "⚂" };

  // Các ô có nút "Tìm hiểu thêm"
  const MORE_INFO_IDS = new Set([3, 5, 7, 9, 12]);

  return (
    <div className="app">
      <h1 className="title">🎮 Hành trình Startup – Minigame</h1>
      <p className="subtitle">Tung xúc xắc, vượt thử thách và về đích!</p>

      <div
        className="layout-two-col"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(260px, 320px) 1fr",
          gap: 16,
          width: "min(1200px, 96vw)", // tăng nhẹ bề rộng tổng
        }}
      >
        {/* Cột trái: Xúc xắc + nút + HUD */}
        <section
          className="left-pane"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "stretch",
          }}
        >
          <div
            className="dice-box"
            style={{
              position: "relative",
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,.16)",
              background:
                "linear-gradient(160deg, rgba(124,58,237,.25), rgba(244,114,182,.18))",
              boxShadow: isRolling
                ? "0 16px 40px rgba(0,0,0,.4), 0 0 26px rgba(124,58,237,.35)"
                : "0 10px 26px rgba(0,0,0,.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              aspectRatio: "1 / 1",
              userSelect: "none",
            }}
          >
            <div
              style={{
                fontSize: "clamp(64px, 10vw, 140px)",
                transform: `rotate(${diceAngle}deg) scale(${
                  isRolling ? 1.12 : 1
                })`,
                transition: isRolling
                  ? "transform 600ms cubic-bezier(0.22,1,0.36,1)"
                  : "transform 300ms cubic-bezier(0.22,1,0.36,1)",
                filter: "drop-shadow(0 6px 14px rgba(0,0,0,.35))",
              }}
              className={diceClass}
              aria-label="Xúc xắc"
            >
              {lastRoll ? diceSymbols[lastRoll] : "🎲"}
            </div>
          </div>

          <div className="controls" style={{ marginBottom: 0 }}>
            <button
              onClick={rollDice}
              disabled={position === 12 || isRolling}
              className="btn btn-primary"
            >
              {isRolling ? "Đang tung…" : "Tung xúc xắc 🎲"}
            </button>
            <button onClick={resetGame} className="btn btn-ghost">
              Chơi lại ↻
            </button>
          </div>

          <div className="hud" style={{ marginBottom: 0 }}>
            <span className="chip">
              Vị trí: <b>{position}</b>/12
            </span>
            <span className="chip">
              Lần tung gần nhất: <b>{lastRoll ?? "—"}</b>
            </span>
          </div>
        </section>

        {/* Cột phải: Board (trái) + Panel bài học (phải) */}
        <section
          className="right-pane"
          style={{
            display: "grid",
            gridTemplateColumns: "auto minmax(260px, 1fr)",
            gap: 12,
            alignItems: "start",
          }}
        >
          <div
            className="board"
            style={{ "--tile": "clamp(64px, 16vw, 110px)" }}
          >
            {board.map((sq) => (
              <div
                key={sq.id}
                className={`tile ${sq.id === position ? "active" : ""}`}
                title={sq.label}
              >
                <div className="id">{sq.id === position ? "🚀" : sq.id}</div>
                <div className="label">{sq.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="panel" style={{ alignSelf: "start" }}>
              <h2>📌 Bài học biện chứng</h2>
              <p>
                {message ?? "Hãy tung xúc xắc để khám phá bài học ở từng ô."}
              </p>
              {MORE_INFO_IDS.has(position) && (
                <button
                  className="btn btn-primary"
                  style={{ marginTop: 12, width: "100%" }}
                  onClick={askChatGpt}
                  disabled={chatGptLoading}
                >
                  {chatGptLoading ? "Đang hỏi ChatGPT..." : "Tìm hiểu thêm 🔎"}
                </button>
              )}
            </div>
            {/* Panel kết quả ChatGPT (mock) */}
            {MORE_INFO_IDS.has(position) && (
              <div
                className="panel"
                style={{
                  alignSelf: "start",
                  background: "rgba(255,255,255,0.10)",
                  minHeight: 48,
                  // Xóa mọi giới hạn chiều cao và overflow để nội dung luôn hiển thị đầy đủ
                  maxHeight: "none",
                  overflow: "visible",
                }}
              >
                <h2 style={{ fontSize: 17, marginBottom: 8 }}>
                  🤖 Kết quả ChatGPT
                </h2>
                {chatGptLoading && (
                  <div style={{ color: "#a5b4fc", fontStyle: "italic" }}>
                    Đang lấy định nghĩa từ ChatGPT...
                  </div>
                )}
                {chatGptResult && (
                  <div
                    style={{
                      marginTop: 2,
                      color: "#f1f5f9",
                      fontSize: 15,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {chatGptResult}
                    {/* Hiển thị nguồn nếu có */}
                    {MOCK_SOURCES[position] && (
                      <div
                        style={{
                          marginTop: 10,
                          color: "#a3e635",
                          fontSize: 13,
                          fontStyle: "italic",
                        }}
                      >
                        {MOCK_SOURCES[position]}
                      </div>
                    )}
                  </div>
                )}
                {!chatGptLoading && !chatGptResult && (
                  <div style={{ color: "#64748b", fontSize: 14 }}>
                    Nhấn "Tìm hiểu thêm" để hỏi ChatGPT về ô này.
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
