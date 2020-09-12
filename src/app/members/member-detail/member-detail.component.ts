import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import {
  NgxGalleryAnimation,
  NgxGalleryImage,
  NgxGalleryOptions,
} from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private route: ActivatedRoute) {}

  // Use a resolver if u don't want to specify nullable in html
  ngOnInit(): void {
    this.route.data.subscribe((d) => {
      this.user = d.user;
    });

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
      },
    ];

    this.galleryImages = this.getImages();
  }

  getImages(): any[] {
    const imageUrls = [];
    for (const p of this.user.photos) {
      imageUrls.push({
        small: p.url,
        medium: p.url,
        big: p.url,
        description: p.description,
      });
    }

    return imageUrls;
  }

  // loadUser(): void {
  //   this.userService.getUserById(+this.route.snapshot.params.id).subscribe(
  //     (user: User) => {
  //       this.user = user;
  //     },
  //     (err) => {
  //       this.alertify.error(err);
  //     }
  //   );
  // }
}
