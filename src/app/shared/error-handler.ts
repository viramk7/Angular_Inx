import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { Router } from '@angular/router';

@Injectable()
export class ErrorsHandlerService implements ErrorHandler {

    constructor(private injector: Injector,
        private toastr: ToastrService) {

    }

    handleError(error: Error | HttpErrorResponse) {
        if (error instanceof HttpErrorResponse) {
            // Server or connection error happened
            if (!navigator.onLine) {
                // Handle offline error
            } else {
              //  if (error.status != 400) {
                    // Handle Http Error (error.status === 403, 404...)
                    if (error.error && typeof (error.error) == "string") {
                        this.toastr.error(error.error, 'Error', { timeOut: 2500, progressBar: true });
                    }
                    else if (typeof (error.error) == "object") {
                        for (var data in error.error) {
                            if (typeof (error.error[data][0]) == "string") {
                                this.toastr.error(error.error[data][0], 'Error', { timeOut: 2500, progressBar: true });
                            }
                        }
                    }
                    else {
                        this.toastr.error('Something went wrong!', 'Error', { timeOut: 2500, progressBar: true });
                    }
                // }
                // if (error.status === 400) {
                //     this.toastr.error('Something went wrong!', 'Error', { timeOut: 2500, progressBar: true });
                // }
            }
        } else {
            // Handle Client Error (Angular Error, ReferenceError...)     
        }
        // Log the error anyway
        console.error('ERROR: ', error);
    }
}