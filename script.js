const API_KEY = "sk_a9fe7cf344a539efdeebdb82ed5e16535e6897f357d18255";
const MAX_CHARS = 50000;

const textArea = document.getElementById("tts-text");
const voiceSelect = document.getElementById("voice-select");
const convertBtn = document.getElementById("convert-btn");
const audioPlayer = document.getElementById("audio-player");
const downloadBtn = document.getElementById("download-btn");
const errorDiv = document.getElementById("error");
const loader = document.getElementById("loader");

convertBtn.addEventListener("click", async () => {
    errorDiv.textContent = "";
    audioPlayer.classList.add("hidden");
    downloadBtn.classList.add("hidden");

    const text = textArea.value.trim();
    if (!text) {
        errorDiv.textContent = "Text cannot be empty.";
        return;
    }
    if (text.length > MAX_CHARS) {
        errorDiv.textContent = `Text exceeds ${MAX_CHARS} characters limit.`;
        return;
    }

    loader.classList.remove("hidden");

    try {
        const voiceId = voiceSelect.value;
        const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "xi-api-key": API_KEY
            },
            body: JSON.stringify({
                text: text,
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75
                }
            })
        });

        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`);
        }

        const arrayBuffer = await res.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);

        audioPlayer.src = url;
        audioPlayer.classList.remove("hidden");
        downloadBtn.classList.remove("hidden");

        downloadBtn.onclick = () => {
            const a = document.createElement("a");
            a.href = url;
            a.download = "azanworld_tts.mp3";
            document.body.appendChild(a);
            a.click();
            a.remove();
        };

    } catch (err) {
        errorDiv.textContent = err.message;
    } finally {
        loader.classList.add("hidden");
    }
});
