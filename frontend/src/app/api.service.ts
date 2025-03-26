import { Injectable } from '@angular/core';
import axios from 'axios';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private backendUrl = 'http://localhost:5000';

  async slashOperator(operator: string, message1: string, message2: string) {
    return axios.post(`${this.backendUrl}/slash`, { operator, message1, message2 });
  }

  async checkDowntime() {
    return axios.get(`${this.backendUrl}/downtime`);
  }

  async registerOperator(operator: string) {
    return axios.post(`${this.backendUrl}/register`, { operator });
  }

  async getOperatorStatus(operator: string) {
    return axios.get(`${this.backendUrl}/status/${operator}`);
  }

}
