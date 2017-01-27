import { environment } from './../../environments/environment';

export var Config = {
    dev: {
        apiUrl: 'http://localhost:3000/query',
        imgUrl: 'http://localhost:3000/',
        playerImgWidth: 280,
        playerImgHeight: 430
    },
    prod: {
        apiUrl: 'http://bloodrush.xyz:3000/query',
        imgUrl: 'http://bloodrush.xyz:3000/',
        playerImgWidth: 280,
        playerImgHeight: 430
    }
}
