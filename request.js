import { store } from './index'

export const getJson = ({ url, method = 'GET', headers = {}, auth = false, data = [] }) => {
    if (data.length && !data instanceof Array) {
        console.error('Data should be Array')
        return
    }

    const props = {
        method: method,
        headers: {
            ...headers,
            'token': auth ? store.get('token') : null
        }
    }

    if (data.length) {
        url = url.concat('?')
        for (let i = 0; i < data.length; i++) {
            url = url.concat(data[i].key).concat('=').concat(data[i].value)
            if (i !== data.length - 1) {
                url = url.concat('&')
            }
        }
    }

    return request(url, props)
}

export const postJson = ({ url, method = 'POST', headers = {}, auth = false, json = true, data }) => {
    let body

    if (json) {
        headers['content-type'] = 'application/json'
        body = JSON.stringify(data)
    } else {
        if (data.length && !data instanceof Array) {
            console.error('Data should be Array')
            return
        }

        let formData = new FormData()
        for (let i = 0; i < data.length; i++) {
            formData.append(data[i].key, data[i].value)
        }
        body = formData
    }

    const props = {
        method: method,
        headers: {
            ...headers,
            'token': auth ? store.get('token') : null
        },
        body: body
    }

    return request(url, props)
}

const request = (url, props) => {
    return new Promise((resolve, reject) => {
        fetch(url, props)
            .then(res => res.json())
            .then(res => {
                resolve(res)
            })
            .catch(error => {
                reject(error)
            })
    })
}
