import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import {
  NgxGalleryAnimation,
  NgxGalleryImage,
  NgxGalleryOptions,
} from '@kolkov/ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { AuthService } from './../../services/auth.service';
import { AlertifyService } from './../../services/alertify.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private auth: AuthService,
    private alertify: AlertifyService) { }

  // Use a resolver if u don't want to specify nullable in html
  ngOnInit(): void {
    this.route.data.subscribe((d) => {
      this.user = d.user;
    });

    this.route.queryParams.subscribe((p) => {
      const selectedTab = p.tab;
      this.memberTabs.tabs[selectedTab > 0 ? selectedTab : 0].active = true;
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

  selectTab(tabId: number): void {
    this.memberTabs.tabs[tabId].active = true;
  }

  sendLike(): void {
    this.userService.sendLike(this.auth.decodedToken.nameid, this.user.id)
      .subscribe(() => {
        this.alertify.success(`You liked ${this.user.knownAs}`);
      }, err => {
        this.alertify.error(err);
      });
  }

}
