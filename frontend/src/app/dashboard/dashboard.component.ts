import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  operatorAddress = '';
  response: string = '';

  constructor(private apiService: ApiService) {}

  async slash() {
    try {
      const res = await this.apiService.slashOperator(this.operatorAddress, 'msg1', 'msg2');
      this.response = res.data.message;
    } catch (err: any) {
      this.response = err.response.data.error;
    }
  }

  async downtime() {
    const res = await this.apiService.checkDowntime();
    this.response = res.data.message;
  }

  async register() {
    const res = await this.apiService.registerOperator(this.operatorAddress);
    this.response = res.data.message;
  }

  async status() {
    const res = await this.apiService.getOperatorStatus(this.operatorAddress);
    this.response = res.data.message;
  }
}
