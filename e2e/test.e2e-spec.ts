import { browser, element, by, ElementFinder } from 'protractor';
 

describe('Example E2E Test', () => {

  beforeEach(() => {
    browser.get('');
  });

  it('the Login tab is displayed by default', () => {

    var user = browser.driver.findElement(by.id('loginButton'));
      expect(user // Grab the title of the selected tab
        .getAttribute('innerHTML')) // Get the text content
        .toContain('Login'); // Check if it contains the text "Home"

  });

  it('the user can login and navigate to home', () => {
   

    console.log('---> inside login ');
    browser.driver.sleep(1000);
    console.log('---> after 10sec login ');
     browser.driver.findElement(by.css('ion-input[name="email"] input')).sendKeys("aloha");
     browser.driver.findElement(by.css('ion-input[id="password"] input')).sendKeys("1234");
   

    // Click the 'About' tab
      browser.driver.findElement(by.id('loginButton')).click().then(() => { 
        console.log('---> Login Clicked ');


       // Wait for the page transition
       browser.driver.sleep(10000);

        console.log('---> Sleep Done '+browser.getCurrentUrl());
 
        console.log('---> isDisplayed '+browser.driver.findElement(by.css('ion-label[name="liveviews"] div')).isDisplayed);
 
        expect(browser.driver.findElement(by.css('ion-label[name="liveviews"] div')).isDisplayed).toBe(true);
      
        
      });

  });

  var urlChanged = function(url) {
    return function () {
      return browser.getCurrentUrl().then(function(actualUrl) {
        return url != actualUrl;
      });
    };
  };

});