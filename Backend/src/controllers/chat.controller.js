import path from "path";

export const getChats = async (req, res) => {
  try {
    const chats = demoUsers.map((u) => {
      const msgs = demoMessages[u.id] || [];
      const lastMsg = msgs[msgs.length - 1];

      return {
        id: u.id,
        name: u.name,
        username: u.username,
        online: u.online,
        unread: u.id === "1" ? 2 : 0,
        lastMessage: (lastMsg?.text || "Start chatting...").slice(0, 80),
        updatedAt: lastMsg?.createdAt || Date.now(),
      };
    });

    return res.json({
      success: true,
      message: "Chats fetched",
      data: chats,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message || "Failed to fetch chats",
    });
  }
};

export const getChatById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = demoUsers.find((u) => u.id === id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    return res.json({
      success: true,
      message: "Chat fetched",
      data: {
        chat: user,
        messages: demoMessages[id] || [],
      },
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message || "Failed to fetch chat",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !String(text).trim()) {
      return res.status(400).json({
        success: false,
        message: "Message text required",
      });
    }

    if (!demoMessages[id]) demoMessages[id] = [];

    const msg = {
      id: `m${Date.now()}`,
      sender: "me",
      text: String(text).trim(),
      createdAt: Date.now(),
    };

    demoMessages[id].push(msg);

    return res.status(201).json({
      success: true,
      message: "Message sent",
      data: msg,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message || "Failed to send message",
    });
  }
};
export const sendMediaMessage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Media file required",
      });
    }

    if (!demoMessages[id]) demoMessages[id] = [];

    const ext = path.extname(req.file.filename).toLowerCase();
    const isVideo = req.file.mimetype.startsWith("video/");
    const type = isVideo ? "video" : "image";

    const msg = {
      id: `m${Date.now()}`,
      sender: "me",
      type,
      text: "",
      url: `/uploads/chat/${req.file.filename}`,
      createdAt: Date.now(),
      ext,
    };

    demoMessages[id].push(msg);

    return res.status(201).json({
      success: true,
      message: "Media sent",
      data: msg,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message || "Failed to send media",
    });
  }
};