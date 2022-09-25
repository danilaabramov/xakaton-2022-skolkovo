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
    async UploadVideo(file) {
        var form_data = new FormData()
        form_data.append('file', file)

        let resp = await this.impl.Post('upload', form_data)
        return await resp.json()
    }


    async ProcessVideo(timeSegments, format) {
        let body = {
            'fragments': timeSegments,
            'format': format
        }
        let params = {
            headers: { 'Content-Type': 'application/json' },
        }
        let resp = await this.impl.Post('process', JSON.stringify(body), params)
        return await resp.json()
    }
}


class ClientImpl {

    BASE_URL = '/api'


    async Get(url) {
        return await this.Request(url, {
            method: 'GET'
        })
    }

    async Post(url, data = {}) {
        return await this.Request(url, {
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
