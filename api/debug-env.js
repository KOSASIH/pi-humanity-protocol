export default function handler(req,res){
  const key = process.env.PI_API_KEY || '';
  return res.status(200).json({
    exists: !!key,
    length: key.length,
    first10: key.substring(0,10)
  });
}
