import Button from '@/components/ui/Buttons/Button';
import '../configuration/CSS/Index.module.css';
import RadioGroup from '@/components/ui/Radio/RadioGroup';
import { useState } from 'react';
import CardRadioGroup from '@/components/ui/Radio/CardRadioGroup';
import Layout from '@/components/layout';
import Signup from './Signup/Signup';
import Providers from '@/components/Providers';

export default function Home() {
  // const options = [
  //   { label: 'YES', value: 'YES' },
  //   { label: 'NO', value: 'NO' },
  // ];

  // const cardOptions = [
  //   { label: 'General Contractor', value: 'YES' },
  // ];

  // const [selectedValue, setSelectedValue] = useState('YES');

  // const handleRadioChange = (value: string) => {
  //   setSelectedValue(value);
  // };

  return (
    // <Providers>
    <Layout>
      <Signup />
    </Layout>
    // </Providers>
  );
}
