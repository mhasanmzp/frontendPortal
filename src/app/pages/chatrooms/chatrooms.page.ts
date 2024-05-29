import { AuthService } from '../../services/auth.service';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

import Peer from 'peerjs';

@Component({
  selector: 'app-chatrooms',
  templateUrl: './chatrooms.page.html',
  styleUrls: ['./chatrooms.page.scss'],
})
export class ChatroomsPage implements OnInit {
  @ViewChild('videoPlayer', { static: false }) videoPlayer: ElementRef;
  peer: Peer;
  mediaConnection: any;
  peerId: string;
  stream: MediaStream;
  constructor(
    public authService: AuthService
  ) { }


  ngOnInit() {
    this.peer = new Peer({
      host: this.authService.apiPeerUrl,
      port: 4000,
      secure: true,
      path: '/server',
      debug: 3,
      config: {
        'iceServers': [
          { url: 'stun:stun.l.google.com:19302' }
        ]
      }
    });


    this.peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
    });


    // Peer.MediaConnection

    // const peer = new Peer({
    //   host: this.authService.apiPeerUrl,
    //   path: '/peerjs',
    //   secure: true,
    //   port: 443
    // });

    this.peer.on("call", (call) => {
      console.log(' answer call ');
      // call.answer(stream)
      // call.on("stream", (remoteStream) => {
      //   console.log(' getting remoteStream ');
      //   video.srcObject = remoteStream;
      // });

    });
  }

  ionViewDidLoad() {



  }


  async newPeer() {


    console.log("  ionViewDidLoad ");

    const video = this.videoPlayer.nativeElement;
    // const mediaSource = new MediaSource();

    // When the MediaSource is open, create a source buffer
    // mediaSource.addEventListener('sourceopen', () => {
    //   const sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');

    //   // Fetch the video data and append it to the source buffer
    //   fetch('https://the-meet.com/assets/images/the-meet.mp4')
    //     .then(response => response.arrayBuffer())
    //     .then(buffer => {
    //       sourceBuffer.appendBuffer(buffer);
    //     });
    // });

    const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });

    // Set the MediaSource as the video source

    // this.peer = new Peer("1234");

    // console.log(" new peer ");


    // this.peer.on('open', () => {
    //   console.log('Connected to peer server with ID:', this.peer.id);
    // });

    // const peer = new Peer('1234', {
    //   host: this.authService.apiPeerUrl,
    //   secure: true,
    //   path: '/server',
    //   port: 4000, // the same port number as your server
    // });


    // const peer = new Peer({
    //   host: this.authService.apiPeerUrl,
    //   port: 4000,
    //   secure: true,
    //   path: '/server',
    //   debug: 3,
    //   config: {
    //     'iceServers': [
    //       { url: 'stun:stun.l.google.com:19302' }
    //     ]
    //   }
    // });

    // peer.on('open', (id) => {
    //   console.log('My peer ID is: ' + id);
    // });


    // Peer.MediaConnection

    // const peer = new Peer({
    //   host: this.authService.apiPeerUrl,
    //   path: '/peerjs',
    //   secure: true,
    //   port: 443
    // });


    // peer.on('open', () => {
    //   console.log('Connected to peer server with ID:', peer.id);
    // });

    // peer.on("call", (call) => {
    //   console.log(' answer call ');
    //   call.answer(stream)
    //   call.on("stream", (remoteStream) => {
    //     console.log(' getting remoteStream ');
    //     video.srcObject = remoteStream;
    //   });

    // });



    // peer.on('connection', (otherPeer) => {
    //   console.log('Incoming connection from: ', otherPeer.connectionId);


      // otherPeer.on("open", () => {
      //   // otherPeer.send(stream);
      // });

      // peer.on("connection", (conn) => {
      //   conn.on("data", (data) => {
      //     // Will print 'hi!'
      //     console.log(data);
      //   });
      //   conn.on("open", () => {
      //     conn.send("hello!");
      //   });
      // });


    // });


  }

  answerCall() {

  }

  async connect(peerId) {

    // let peer = new Peer('1234567', {
    //   host: this.authService.apiPeerUrl,
    //   // secure: true,
    //   path: '/server',
    //   // port: 443
    //   port: 3000, // the same port number as your server
    //   // path: '/', // change to any desired path
    // });


    // const peer = new Peer({
    //   host: this.authService.apiPeerUrl,
    //   port: 4000,
    //   secure: true,
    //   path: '/server',
    //   debug: 3,
    //   config: {
    //     'iceServers': [
    //       { url: 'stun:stun.l.google.com:19302' }
    //     ]
    //   }
    // });

    // peer.on('open', (id) => {
    //   // peerId = id;
    //   console.log('My peer ID is: ' + id);
    // });

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });


    this.peer.on('open', async () => {
      console.log('Connected to peer server with ID:', this.peer.id);
      // this.connectToPeer("1234");

      let call = this.peer.call(peerId, stream);

      call.on("stream", (remoteStream) => {
        // const video = this.videoPlayer.nativeElement;
        console.log(" getting remoteStream video ");
        // video.srcObject = remoteStream;
        // Show stream in some <video> element.
      });

    });



    // console.log(" connect peer ");
    // let connection = this.peer.connect("1234");

    // connection.on("open", () => {
    //   console.log("peer ");
    //   connection.send("hi!");
    // });

    // peer.on("connection", (conn) => {
    //   conn.on("data", (data) => {
    //     // Will print 'hi!'
    //     console.log("data");
    //   });
    //   // conn.on("open", () => {
    //   //   conn.send("hello!");
    //   // });
    // });
  }

  connectToPeer(peerId: string) {
    // Connect to a remote peer with the given ID
    const conn = this.peer.connect(peerId);

    // Handle incoming data from the remote peer
    conn.on('data', (data) => {
      console.log('Received data: ');
    });
  }

}
