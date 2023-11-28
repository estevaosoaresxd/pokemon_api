module.exports = {
    sucess: function (obj, name) {
        let resp = { status: true }
        if (name) resp[name] = obj
        else resp.data = obj

        return resp
    },
    fail: function (message) {
        return { status: false, message: message }
    }
}