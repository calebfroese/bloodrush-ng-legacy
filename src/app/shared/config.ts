import { environment } from './../../environments/environment';

export const Config = {
    dev: {
        apiUrl: 'http://localhost:3000/api',
        imgUrl: 'http://localhost:3000/',
        playerImgWidth: 280,
        playerImgHeight: 430
    },
    prod: {
        apiUrl: 'http://bloodrush.ddns.net:3000/api',
        imgUrl: 'http://bloodrush.ddns.net:3000/',
        playerImgWidth: 280,
        playerImgHeight: 430
    },
    versionNumber: '2.0.7-2'
};
