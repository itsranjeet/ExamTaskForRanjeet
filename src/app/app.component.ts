import { Component } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { ApiserviceService } from './apiservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})



export class AppComponent {
  closeResult!: string;
  page = 1;
  pageSize = 30;
  collectionSize: any;
  dataList: any = [];
  resultArray: any = [];
  searchText!: string;
  name: string = '';
  desc: string = '';
  constructor(
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private apiService: ApiserviceService,
    private toastr: ToastrService
  ) {
    this.getAllManufacturer();
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  refreshTable() {
    this.resultArray = this.dataList.map((response: any, i: number) => ({ id: i + 1, ...response }))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  getAllManufacturer() {
    this.spinner.show();
    this.apiService.postMethod('http://159.65.151.134/api/ManufacturerAPI/GetAll', {}).subscribe((res: any) => {
      console.log(res);
      this.dataList = res;
      this.collectionSize = this.dataList.length;
      this.resultArray = this.dataList.map((response: any, i: number) => ({ id: i + 1, ...response }))
        .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toastr.error('Internal server error', 'Error');
    })
  }
  onOptionsSelected(event: any) {
    console.log(event);
    let value = event.target.value;
    if (value == 'asc') {
      this.resultArray.sort((a: any, b: any) => {
        let fa = a.manufacturerName.toLowerCase(),
          fb = b.manufacturerName.toLowerCase();
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
      console.log(this.resultArray);
    }
    else if (value == 'desc') {
      console.log('desc');
      this.resultArray.sort(function (a: any, b: any) {
        let fa = a.manufacturerName.toLowerCase(),
          fb = b.manufacturerName.toLowerCase();
        if (fa > fb) {
          return -1;
        }
        if (fb > fa) {
          return 1;
        }
        return 0;
      });
    }
    console.log(this.resultArray);
  }
  saveData() {
    const body = {
      "manufacturerName": this.name,
      "description": this.desc
    }
    this.apiService.postMethod('http://159.65.151.134/api/ManufacturerAPI/Post', body).subscribe((res: any) => {
      console.log(res);
      if (res.isSuccess) {
        this.toastr.success('Added SuccessFully', 'Success');
        this.modalService.dismissAll();
        this.getAllManufacturer();
      }
      else {
        console.log('error')
      }
    }, error => {
      this.toastr.error('Internal server error', 'Error');
    })
  }
}
