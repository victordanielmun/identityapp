import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { NotificationComponent } from './components/modals/notification/notification.component';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private modalService: BsModalService) {}
    bsModalRef?: BsModalRef;

    showNotification(isSucces: boolean, title: string, message: string) {
     const initialState: ModalOptions = {
       initialState: {
         isSucces,
         title,
         message
       }
     

    };
    this.bsModalRef = this.modalService.show(NotificationComponent, initialState);

  }
}
