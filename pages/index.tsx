import Button from '@/components/ui/Buttons/Button';
import '../configuration/CSS/Index.module.css';
import RadioGroup from '@/components/ui/Radio/RadioGroup';
import { useState } from 'react';
import CardRadioGroup from '@/components/ui/Radio/CardRadioGroup';
import Layout from '@/components/layout';
import Signup from './Signup/Signup';

export default function Home() {

  return (
    <Layout>
      <Signup />
    </Layout>
  );
}
