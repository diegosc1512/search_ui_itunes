/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ArtistComponent } from './artist.component';
let component : ArtistComponent; 
describe('ItunesComponent', () => {
  let component: ArtistComponent;
  let fixture: ComponentFixture<ArtistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistComponent ]
    })
    .compileComponents();
    }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

      //title
  it(`should have as title 'Itunes search engine'`, () => {
    let myVar : string = component.selectedArtist;
    expect(myVar).toEqual('ITunes search engine ');
  });

});


