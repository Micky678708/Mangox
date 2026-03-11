export const uploadReel = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Video file required"
      })
    }

    const caption = req.body.caption || ""

    const rawPath = req.file.path

    const convertedPath = await convertToBrowserMp4(rawPath)

    const finalFileName = path.basename(convertedPath)

    const base = process.env.BASE_URL

    const reel = await Reel.create({
      user: req.user._id,
      caption,
      videoUrl: `${base}/uploads/reels/${finalFileName}`,
      thumbnailUrl: "",
      likes: [],
      saves: []
    })

    return res.status(201).json({
      success: true,
      message: "Reel uploaded",
      data: reel
    })

  } catch (e) {

    console.error("uploadReel error:", e)

    return res.status(500).json({
      success: false,
      message: e.message || "Upload failed"
    })
  }
}