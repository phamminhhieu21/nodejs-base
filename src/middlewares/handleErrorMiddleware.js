import createError from "http-errors"
export const badRequest = (err, resp) => {
  const error = createError.BadRequest(err) 
  return resp.status(error.status).json({
    code : 1,
    message : error.message
  })
}
export const UnauthorizedError = (err, resp) => {
  const error = createError.Unauthorized(err)
  return resp.status(error.status).json({
    code : 1,
    message : error.message
  })
}
export const internalServerError = (res) => {
  const error = createError.InternalServerError()
  return res.status(error.status).json({
    code : 1,
    message : error.message
  })
}
export const notFound = (req, res) => {
  const error = createError.NotFound('This route does not exist')
  return res.status(error.status).json({
    code : 1,
    message : error.message
  })
}