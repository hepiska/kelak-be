const ImageKit = require("imagekit")

const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_SERVICE_KEY_PUBLIC,
  privateKey: process.env.IMAGE_SERVICE_KEY_PRIVATE,
  urlEndpoint: process.env.IMAGE_SERVICE_URI
})


export const uploadImage = async data => {
  const res = await imagekit.upload(data)

  res.uri = res.url

  return res
}
