export async function streamAgentResponse(
  prompt: string,
  onMessage: (data: any) => void,
  onDone?: () => void,
) {
  const eventSource = new EventSource("http://localhost:8000/stream_response", {
    withCredentials: false,
  });

  // Gửi request bằng fetch POST trước khi mở SSE
  // Vì SSE chỉ nhận, không gửi data được trực tiếp.
  // Nên ta gửi prompt bằng fetch POST -> backend trả về stream SSE.

  const res = await fetch("http://localhost:8000/stream_response", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  eventSource.onopen = () => {
    console.log("Connection to server opened.");
  };

  // Parse response dạng stream text/event-stream
  const reader = res.body!.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Cắt theo "data: ..."
    const lines = buffer.split("\n\n");
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const json = JSON.parse(line.replace("data: ", ""));
          onMessage(json);
        } catch (err) {
          console.error("Parse error:", err);
        }
      }
    }
  }

  onDone?.();
}
