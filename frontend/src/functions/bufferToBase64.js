export default function _arrayBufferToBase64(buffer) 
{
    var enc = new TextDecoder("utf-8");
    var arr = new Uint8Array(buffer)
    return "data:image(png|jpg);base64," + enc.decode(arr)
}