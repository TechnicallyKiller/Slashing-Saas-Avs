import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from "axios";


@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontendeded';

  operator = "";
  message1 = "";
  message2 = "";
  result = "";
  isSuccess = false;


  async slashOperator() {
    this.result = ""; // Clear previous result
    this.isSuccess = false;

    // Basic input validation
    if (!this.operator || !this.isValidEthereumAddress(this.operator) || !this.message1 || !this.message2) {
      this.result = "❌ Please enter valid operator address, message 1, and message 2.";
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/slash", {
        operator: this.operator,
        message1: this.message1,
        message2: this.message2,
      });
      this.result = response.data.message;
      this.isSuccess = response.data.success;
    } catch (error: any) {
      this.result = "❌ Error: " + (error.response?.data?.message || error.message || "Unknown error");
      this.isSuccess = false;
    }
  }

  async checkDowntime() {
    this.result = ""; // Clear previous result

    try {
      const response = await axios.post("http://localhost:3000/api/downtime"); // Removed operator from request
      // Check if the response was successful
      if (response.data.success) {
        this.result = "Downtime check initiated.  See operators.json for results.";
        this.isSuccess = true; // Assuming initiation is success
      } else {
         // If backend reported failure
        this.result = response.data.message || "Downtime check failed (no details).";
        this.isSuccess = false;
      }


    } catch (error: any) {
      this.result = "❌ Error: " + (error.response?.data?.message || error.message || "Unknown error");
      this.isSuccess = false;
    }
  }

  async registerDummyOperators() {
    this.result = "";
    this.isSuccess = false;
    try {
      const response = await axios.post("http://localhost:3000/api/register");
      if(Array.isArray(response.data)) { // Check if response is an array
          // Iterate through each registration result
          const messages = response.data.map((res: any) => res.message);
          this.result = messages.join('\n');
          this.isSuccess = response.data.every((res: any) => res.success);
      } else {
        // Handle unexpected response format
          this.result = 'Unexpected response format from server.';
          this.isSuccess = false;
      }
    } catch(error: any) {
        this.result = "❌ Error: " + (error.response?.data?.message || error.message || "Unknown error");
        this.isSuccess = false;
    }
  }

  operatorToCheck: string = "";
  operatorStatus: any = null;

  async checkOperatorStatus() {
    this.operatorStatus = null; // Clear previous result
    try {
        const response = await axios.post("http://localhost:3000/api/checkOperator", {
            operatorAddress: this.operatorToCheck,
        });

        if (response.data.success) {
            this.operatorStatus = response.data;
        } else {
            this.operatorStatus = { message: response.data.message }; // Display error message
        }
    } catch (error: any) {
        this.operatorStatus = { message: "❌ Error: " + (error.response?.data?.message || error.message || "Unknown error") };
    }
}



  // Helper function for basic Ethereum address validation
  isValidEthereumAddress(address: string): boolean {
    return /^0x[0-9a-fA-F]{40}$/.test(address);
  }  
}
