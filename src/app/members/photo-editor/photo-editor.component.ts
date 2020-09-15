import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from './../../../environments/environment';
import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service';
import { AlertifyService } from './../../services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css'],
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];

  currentMain: Photo;
  baseUrl = environment.apiUrl;
  uploader: FileUploader;
  hasBaseDropZoneOver = false;

  constructor(
    private auth: AuthService,
    private user: UserService,
    private alertify: AlertifyService
  ) {}

  ngOnInit(): void {
    this.initUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initUploader(): void {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.auth.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, res, status, headers) => {
      if (res) {
        const response: Photo = JSON.parse(res);
        const photo = {
          id: response.id,
          url: response.url,
          dateAdded: response.dateAdded,
          description: response.description,
          isMain: response.isMain,
        };
        this.photos.push(photo);
        if (photo.isMain) {
          this.auth.changeMemberPhoto(photo.url);
          this.auth.currentUser.photoUrl = photo.url;
          localStorage.setItem('user', JSON.stringify(this.auth.currentUser));
        }
      }
    };
  }

  setMainPhoto(photo: Photo): void {
    this.user.setMainPhoto(this.auth.decodedToken.nameid, photo.id).subscribe(
      () => {
        this.currentMain = this.photos.filter((p) => p.isMain === true)[0];
        this.currentMain.isMain = false;
        photo.isMain = true;
        this.auth.changeMemberPhoto(photo.url);
        this.auth.currentUser.photoUrl = photo.url;
        localStorage.setItem('user', JSON.stringify(this.auth.currentUser));
      },
      (err) => {
        this.alertify.error(err);
      }
    );
  }

  deletePhoto(id: number): void {
    this.alertify.confirm('Are you sure you want to delete this photo?', () => {
      this.user.deletePhoto(this.auth.decodedToken.nameid, id).subscribe(
        () => {
          this.photos.splice(
            this.photos.findIndex((p) => p.id === id),
            1
          );
          this.alertify.success('Photo has been deleted.');
        },
        (err) => {
          this.alertify.error('Failed to delete the photo.');
        }
      );
    });
  }
}
