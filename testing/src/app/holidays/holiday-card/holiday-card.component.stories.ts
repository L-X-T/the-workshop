import { moduleMetadata } from '@storybook/angular';
import { Meta } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { Story } from '@storybook/angular/types-6-0';

import { HolidayCardComponent } from './holiday-card.component';

export default ({
  title: 'Eternal/HolidayCard',
  component: HolidayCardComponent,
  decorators: [moduleMetadata({ imports: [MatButtonModule, MatCardModule, RouterTestingModule] })],
  argTypes: { holiday: { name: 'Holiday', description: 'JSON object for the Holiday' } }
} as unknown) as Meta;

const Template: Story<HolidayCardComponent> = (args: HolidayCardComponent) => {
  return {
    component: HolidayCardComponent,
    props: args
  };
};

export const Default = Template.bind({});
Default.args = {
  holiday: {
    id: 1,
    title: 'Holiday',
    description: 'A holiday',
    imageUrl: 'https://eternal-app.s3.eu-central-1.amazonaws.com/assets/AngkorWatSmall.jpg'
  }
};
