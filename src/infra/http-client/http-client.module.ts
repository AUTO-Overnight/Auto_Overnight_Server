import Axios from 'axios';
import { wrapper as axiosCookieJarSurpport } from 'axios-cookiejar-support';
import { HttpModule, HttpModuleOptions } from '@nestjs/axios';
import { CookieJar } from 'tough-cookie';
import { DynamicModule } from '@nestjs/common';

export class HttpClientModule {
  static registerForSchool(config: HttpModuleOptions): DynamicModule {
    const axiosInstance = this.setAxiosInstance(config);
    return {
      module: HttpModule,
      providers: [
        {
          provide: 'AXIOS_INSTANCE_TOKEN',
          useValue: axiosInstance,
        },
      ],
    };
  }

  static setAxiosInstance(config: HttpModuleOptions) {
    const axiosInstance = Axios.create(config);
    axiosCookieJarSurpport(axiosInstance);
    axiosInstance.defaults.jar = new CookieJar();
    axiosInstance.defaults.headers.get['User-Agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36';
    axiosInstance.defaults.headers.post['User-Agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36';
    axiosInstance.defaults.withCredentials = true;
    axiosInstance.defaults.maxRedirects = 10;
    return axiosInstance;
  }
}
