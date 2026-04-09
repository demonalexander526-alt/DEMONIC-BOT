
const { sendMenuAudio } = require("./menuaudio");
const path = require("path");

const mockSock = {
    sendMessage: async (jid, content) => {
        console.log("Mock sendMessage called with:", content);
        return { key: { id: "mockId" } };
    }
};

(async () => {
    console.log("Testing sendMenuAudio...");
    try {
        await sendMenuAudio(mockSock, "12345@s.whatsapp.net");
    } catch (e) {
        console.error("Test failed:", e);
    }
})();
