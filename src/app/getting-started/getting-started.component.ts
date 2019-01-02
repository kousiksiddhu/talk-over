import { RouterModule, RouterState } from "@angular/router";
import { PlatformLocation } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import { Observable } from "rxjs";

@Component({
  selector: "getting-started",
  templateUrl: "./getting-started.component.html",
  styleUrls: ["./getting-started.component.css"]
})
export class GettingStartedComponent implements OnInit {
  conversationUrl: string;
  collection: AngularFirestoreCollection;
  document: AngularFirestoreDocument;
  UID: string;
  constructor(
    private db: AngularFirestore,
    private platformLocation: PlatformLocation
  ) {
    this.collection = db.collection("conversations");
  }

  ngOnInit() {}

  generateAnonymousLink(
    title: HTMLInputElement,
    description: HTMLInputElement
  ) {
    this.UID = this.getUID();

    this.collection
      .doc(this.UID)
      .set({
        title: title.value || "Start Chatting",
        description:
          description.value ||
          "This is an anonymous chat platform. User identity will not be revealed.",
        message: []
      })
      .catch(error => {
        alert("Error Occured");
      })
      .then(response => {
        console.log(response);
        let baseUrl = (this.platformLocation as any).location.href;

        if (baseUrl) {
          this.conversationUrl = baseUrl + "chat/" + this.UID;
          setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
          });
        }
      });
  }

  getUID() {
    let date = new Date();
    let components = [
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    ];

    return components.join("");
  }

  copyConversationUrl(conversationUrlInput: HTMLInputElement) {
    conversationUrlInput.select();
    document.execCommand("copy");
  }

  openDialog(): void {}
}
