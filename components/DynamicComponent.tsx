import React, { useContext, useEffect } from 'react';
import { Address, CardRadioGroup, ColumnCards, GoogleLoginComponent, LoginPasswordAsk, PasswordInput, SelectInputField, MultiSelectInput, AutoCompleteInput, CheckboxGroup, Invoice, SearchInput, ShowDetails, FileUploadComponent, Summary, Table, CostCards, InstallationInfo, StripeComponent, DateTimePicker, CostMilestone, ProjectCard, RatingCard, ReferralCard, RadioGroup } from './ui';
import { InlineWidget } from 'react-calendly';
import NextFunction from './NextFunction';
import { Message } from '@/types/chat';
import ThemeContext from '@/contexts/ThemeContext';

type ComponentFunction = () => JSX.Element | null;
type ComponentsType = {
  [key: string]: ComponentFunction;
};


interface DynamicComponentProps {
  handleSubmit: (val?: string) => void
  handleFileUpload: (file: FileList) => void
  messages: Message[],
  message: Message
  index: number
}

export const DynamicComponent: React.FC<DynamicComponentProps> = ({ message, index, messages, handleSubmit, handleFileUpload }) => {
  const { JSModule, styles } = useContext(ThemeContext);
  const isLastMessage = index === messages.length - 1;
  const { type, step } = message;
  const { inputType, integration, html, options, answer, disabled, defaultValue, data, question } = step || {};

  const handleChange = (value: string) => {
    if (isLastMessage) {
      handleSubmit(value);
    }
  };

  const components: ComponentsType = {
    radioButton: () =>
      integration === 'Calandly' ? <InlineWidget url="https://calendly.com/aashishrawte1/15min" />
        :
        <RadioGroup
          options={options}
          value={message?.step?.default}
          disabled={!isLastMessage}
          onChange={(value: any) => isLastMessage && handleSubmit(value)}
        />
    ,


    html: () => <div dangerouslySetInnerHTML={{ __html: html }} />,

    googleLogin: () => (
      <GoogleLoginComponent
        disabled={!isLastMessage}
        handleSubmit={(value) => isLastMessage && handleSubmit(value)}
        options={options}
        value={answer}
      />
    ),

    password: () =>
      !isLastMessage ? (
        <PasswordInput
          disabled={disabled || true}
          value={answer}
          onChange={() => null}
        />
      ) : null,

    loginPasswordAsk: () => (
      <LoginPasswordAsk
        disabled={!isLastMessage}
        onSave={(value) => isLastMessage && handleSubmit(value)}
        options={options}
      />
    ),

    address: () => (
      <Address
        states={
          message?.step?.options?.stateOptions
        }
        cities={
          message?.step?.options?.cityOptions
        }
        onSave={() => {
          if (isLastMessage) {
            handleSubmit();
          }
        }}
        zip={''}
        street={''}
      />
    ),

    cardRadio: () => (
      <CardRadioGroup
        value={message?.step?.default}
        disabled={!isLastMessage}
        onChange={(value) => {
          if (isLastMessage) {
            handleSubmit(value);
          }
        }}
        options={message?.step?.options}
      />
    ),
    columnCards: () => (
      <ColumnCards
        disabled={!isLastMessage}
        onChange={handleChange}
        options={options}
      />
    ),
    select: () => (
      <SelectInputField
        value={defaultValue}
        onChange={handleChange}
        options={options}
      />
    ),
    multiselect: () => (
      <MultiSelectInput
        value={defaultValue}
        onChange={handleChange}
        options={options}
      />
    ),
    autoComplete: () => (
      <AutoCompleteInput
        value={defaultValue}
        onChange={handleChange}
        options={options}
        disabled={false}
      />
    ),
    checkboxButton: () => (
      <CheckboxGroup
        values={''}
        options={options}
        onChange={handleChange}
      />
    ),
    invoice: () => (
      <Invoice
        options={options}
        values={options}
        showList={inputType === 'invoice'}
        disabled={!isLastMessage}
        onChange={handleChange}
      />
    ),
    invoiceSheet: () => components.invoice(),
    search: () => (
      <SearchInput
        width={'100%'}
        containerwidth={'90%'}
        onChange={handleChange}
      />
    ),
    bottext: () => <NextFunction handleSubmit={handleSubmit} />,
    constructiondetails: () => (
      <ShowDetails
        options={options}
        onSave={() => isLastMessage && handleSubmit()}
      />
    ),
    fileUploader: () => (
      <FileUploadComponent
        handleSubmit={(value, files) => {
          if (isLastMessage) {
            handleSubmit(value);
            handleFileUpload(files);
          }
        }}
      />
    ),
    summary: () => (
      <Summary
        data={data}
        onChange={() => isLastMessage && handleSubmit()}
      />
    ),
    tableComponent: () => (
      <Table products={options} onChange={handleChange} />
    ),
    costCards: () => (
      <CostCards options={options} onChange={handleChange} />
    ),
    InstallationInfo: () => <InstallationInfo onChange={handleChange} />,
    Stripe: () => (
      <StripeComponent options={options} onClose={handleChange} />
    ),
    dateTimePicker: () => <DateTimePicker onClose={handleChange} />,
    costMilestone: () => (
      <CostMilestone
        options={options}
        disabled={!isLastMessage}
        onClose={handleChange}
      />
    ),
    ProjectCard: () => <ProjectCard options={options} />,
    RatingCard: () => (
      <RatingCard options={options} onClose={handleChange} />
    ),
    ReferralCard: () => (
      <ReferralCard
        disabled={!isLastMessage}
        onClose={handleChange}
      />
    )

  };

  const Component = components[inputType];
  return (
    JSModule?.conversational && Component?.()
  )
};
