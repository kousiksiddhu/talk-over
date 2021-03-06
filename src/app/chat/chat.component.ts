import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  CollectionReference
} from "angularfire2/firestore";
import { Observable } from "rxjs";
import { ActivatedRoute, Params } from "@angular/router";
import randomProfile from "random-profile-generator";

export interface Conversation {
  title: string;
  description: string;
  message: Object;
}

export interface User {
  userId: number;
  userName: string;
  userIcon: any;
  continuousMsg: boolean;
}

export interface Messages {
  user: number;
  message: string;
}

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"]
})
export class ChatComponent implements OnInit, OnDestroy {
  document: AngularFirestoreDocument<Conversation>;
  conversations: Observable<Conversation>;
  getRouteId;
  uniqueID: string;
  user: User;
  messages;

  constructor(
    private db: AngularFirestore,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    const profile = randomProfile.profile();
    this.getRouteId = this.activatedRoute.params.subscribe(params => {
      this.uniqueID = params["id"];
    });

    this.document = this.db.doc<Conversation>("conversations/" + this.uniqueID);
    this.conversations = this.document.valueChanges();
    this.messages = this.document
      .collection("messages", ref => ref.orderBy("timestamp"))
      .valueChanges();

    this.messages.subscribe(value => {
      if (
        value &&
        value.length &&
        value[value.length - 1].user === this.user.userId
      ) {
        this.user.continuousMsg = true;
        setTimeout(() => {
          this.scrollToBottom();
        });
      }
    });
    console.log(profile);

    this.user = {
      userId: profile.id,
      userName: profile.fullName,
      userIcon: profile.avatar,
      continuousMsg: false
    };
  }

  sendMessage(message: HTMLInputElement) {
    if (!message.value) {
      return false;
    }

    const msg = {
      user: this.user.userId,
      userName: this.user.userName,
      userIcon: this.user.userIcon,
      continuousMsg: this.user.continuousMsg,
      message: message.value,
      timestamp: new Date()
    };

    console.log(this.user);
    this.document
      .collection("messages")
      .add(msg)
      .catch(error => {
        alert("Error Occured");
        console.log(error);
      })
      .then(response => {
        console.log(response);
      });
    message.value = "";
    return false;
  }

  scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  ngOnDestroy() {
    this.getRouteId.unsubscribe();
  }
}
