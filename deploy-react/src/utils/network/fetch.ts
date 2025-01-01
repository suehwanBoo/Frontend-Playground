interface fetchArguments {
  baseUrl: string;
  timeout?: number;
  credentials?: "same-origin" | "include" | "omit";
  Authorization?: string;
}

class FetchController {
  public baseUrl: string;
  public timeout?: number;
  public credentials?: "same-origin" | "include" | "omit";
  public Authorization?: string;

  constructor(args: fetchArguments) {
    this.baseUrl = args.baseUrl;
    this.timeout = args.timeout;
    this.credentials = args.credentials;
    this.Authorization = args.Authorization;
  }

  private async _timeExec<T>(
    fetchFunc: Promise<T>
  ): Promise<T | { timeout: true }> {
    const timerFunc = new Promise<{ timeout: true }>((resolve) => {
      setTimeout(() => {
        resolve({ timeout: true });
      }, this.timeout);
    });
    return Promise.race([fetchFunc, timerFunc]);
  }

  private async _exec(endPoint: string, options: RequestInit) {
    const requestUrl = this.baseUrl + endPoint;
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(this.Authorization ? { Authorization: this.Authorization } : {}),
    };
    const fetchFunc = fetch(requestUrl, {
      method: options.method,
      headers,
      credentials: this.credentials,
      body: options.body,
    });
    const result = this.timeout
      ? await this._timeExec(fetchFunc)
      : await fetchFunc;
    if ((result as { timeout: true }).timeout) {
      throw new Error(`time expired ${this.timeout}ms`);
    }
    const response = result as Response;
    if (!response.ok) {
      throw new Error(
        `HTTP Error: ${response.status} - ${response.statusText}`
      );
    }
    return response;
  }

  public async get(endPoint: string) {
    return await this._exec(endPoint, {
      method: "GET",
    });
  }

  public async post(endPoint: string, body?: BodyInit, headers?: HeadersInit) {
    return await this._exec(endPoint, {
      method: "POST",
      body,
      headers,
    });
  }

  public async put(endPoint: string, body?: BodyInit, headers?: HeadersInit) {
    return await this._exec(endPoint, {
      method: "PUT",
      body,
      headers,
    });
  }
  public async patch(endPoint: string, body?: BodyInit, headers?: HeadersInit) {
    return await this._exec(endPoint, {
      method: "PATCH",
      body,
      headers,
    });
  }
  public async delete(
    endPoint: string,
    body?: BodyInit,
    headers?: HeadersInit
  ) {
    return await this._exec(endPoint, {
      method: "DELETE",
      body,
      headers,
    });
  }
}

export default FetchController;
