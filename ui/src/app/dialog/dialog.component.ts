// import { Component, ContentChild, Directive, HostListener, Input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';

// @Directive({
//   selector: '[appDialogContent]',
// })
// export class DialogContentDirective {
//   constructor(public tpl: TemplateRef<any>) {}
// }

// @Directive({
//   selector: '[appDialogFooter]',
// })
// export class DialogFooterDirective {
//   constructor(public tpl: TemplateRef<any>) {}
// }

// @Directive({
//   selector: '[appDialogHeader]',
// })
// export class DialogHeaderDirective {
//   constructor(public tpl: TemplateRef<any>) {}
// }

// @Component({
//   selector: 'app-dialog',
//   imports: [],
//   template: `
//   <section class="container">
//     <header>
//       <ng-container #headerVcr></ng-container>
//       <h3 *ngIf="!header?.tpl">{{ title }}</h3>
//     </header>
    
//     <main>
//       <ng-container #contentVcr></ng-container>
//     </main>
//     <footer>
//       <button (click)="close()">Close</button>
//       <ng-container #footerVcr></ng-container>
//     </footer>
//   </section> 
// `,
//   styleUrl: './dialog.component.scss'
// })
// export class DialogComponent {
//   @ContentChild(DialogContentDirective) content!: DialogContentDirective;
//   @ContentChild(DialogHeaderDirective) header!: DialogHeaderDirective;
//   @ContentChild(DialogFooterDirective) footer!: DialogFooterDirective;

//   @ViewChild('contentVcr', { read: ViewContainerRef, static: true })
//   private contentVcr!: ViewContainerRef;

//   @ViewChild('headerVcr', { read: ViewContainerRef, static: true })
//   private headerVcr!: ViewContainerRef;

//   @ViewChild('footerVcr', { read: ViewContainerRef, static: true })
//   private footerVcr!: ViewContainerRef;

//   @Input() title!: string;

//   @HostListener('cancel')
//   onDialogCancel() {
//     this.clear();
//   }

//   @HostListener('click', ['$event'])
//   onDialogClick(event: MouseEvent) {
//     if (event.target.nodeName === 'DIALOG') {
//       this.close();
//     }
//   }

//   showModal() {
//     this.host.nativeElement.showModal();
//     this.contentVcr.createEmbeddedView(this.content.tpl);
//     this.header?.tpl && this.headerVcr.createEmbeddedView(this.header.tpl);
//     this.footer?.tpl && this.footerVcr.createEmbeddedView(this.footer.tpl);
//   }

//   close() {
//     this.element.addEventListener(
//       'animationend',
//       (e: AnimationEvent) => {
//         if (e.animationName === 'fadeOut') {
//           this.element.close();
//           this.clear();
//           this.element.removeAttribute('closing');
//         }
//       },
//       { once: true }
//     );

//     this.element.setAttribute('closing', 'true');
//   }

//   private get element() {
//     return this.host.nativeElement;
//   }

//   private clear() {
//     this.contentVcr.clear();
//     this.footerVcr.clear();
//     this.headerVcr.clear();
//   }
// }
