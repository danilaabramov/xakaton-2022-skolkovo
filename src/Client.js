export default class Client {
    constructor() {
        this.impl = new ClientImpl()
    }

    async Ping() {
        let resp = await this.impl.Get('ping')
            .catch(e => {
                console.log(`Failed to access server: ${e}`)
                return null
            })

        if (resp == null) return

        let data = await resp.json()
        console.log(`Server ping: ${data['message']}`)
    }


    // input: DOM node matching selector input[type="file"]
    async UploadVideo(input) {
        var form_data = new FormData()
        form_data.append('file', input.files[0])

        let resp = await this.impl.Post('upload', form_data)
        return await resp.json()
    }
}


class ClientImpl {

    BASE_URL = ''


    async Get(url) {
        return await fetch(url, {
            method: 'GET'
        })
    }

    async Post(url, data = {}) {
        return await fetch(url, {
            method: 'POST',
            body: data
        })
    }

    async Request(url, params) {
      return await fetch(`${this.BASE_URL}/${url}`, {
        ...params,
        credentials: 'same-origin',
      })
    }
}
