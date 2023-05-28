import * as services from "../services";

export const register = async (req, res) => {
  try{
    const resp = await services.register();
    return res.status(200).json({
      code: 0,
      message: 'success',
    });
  }
  catch(err){
    return res.status(500).json({
      code : -1,
      message: 'Internal Server Error',
    });
  }
}