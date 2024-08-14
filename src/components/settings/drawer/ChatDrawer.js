import React,{ useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Divider, Dialog, Stack, Typography, IconButton } from '@mui/material';
// utils
import { bgBlur } from '../../../utils/cssStyles';
import {useAuthContext} from "@/auth/useAuthContext";
import Iconify from '../../iconify';
import { defaultSettings } from '../config-setting';
import { useSettingsContext } from '../SettingsContext';
import ToggleButtonChat from './ToggleButtonChat';
import ChatMessageInput from '../../../features/chat/message/ChatMessageInput';
import ChatMessageList from '../../../features/chat/message/ChatMessageList';

import Usuario from "@/Models/Usuario";
import Empresa from '@/Models/Empresa';

const SPACING = 2.5;

export default function ChatDrawer() {
  const {
    themeMode,
    themeLayout,
    themeStretch,
    themeContrast,
    themeDirection,
    themeColorPresets,
  } = useSettingsContext();

let conversation= localStorage.getItem('conversation') ? JSON.parse(localStorage.getItem('conversation')) :[];

const theme = useTheme();

const [open, setOpen] = useState(false);

const [messages, setMessages] = useState(conversation);

const {sesion} = useAuthContext()

const user = sesion?.usuario

const business= sesion?.empresa

const [email, setEmail] = useState('');

const [emailSent, setEmailSent] = useState(false);
     
const handleSendMessage = async (value) => {
  try {
    let body=value.body;
    conversation =[...conversation,value];
    setMessages(messages.flat());
    localStorage.setItem('conversation',JSON.stringify(conversation.flat()));
    if (emailSent) {
        const empresa= await Empresa.getById({id: business.id}, "ruc")
        const data={
            msg:value.body,
            name: user.nombres,
            lastname: user.apellidos,
            ruc: empresa?.data?.empresaById?.ruc
        }
        await Usuario.sendEmail(email, data);
        setEmailSent(false);
        body = 'correo enviado';
      }
    setTimeout(async () => {
        const listMessages=await Usuario.sendMessage(body,user.id);
        const dataPromises = listMessages.data.sendMessage.data.data.map(async (element) => {
        const data = {
            body:element.text,
            createdAt: new Date(),
            contentType: element.type
        }; 
        if(element.intent==='other - custom'){
            setEmail(value.body);
            setEmailSent(true);
        }

            return data;
        });
        const dataResults = await Promise.all(dataPromises);
        conversation =[...conversation, dataResults];
        setMessages(messages.flat());
        localStorage.setItem('conversation',JSON.stringify(conversation.flat()));
    }, 1000);
  } catch (error) {
    console.error(error);
  }
};

  const handleToggle =async () => {
    setOpen(!open);
    if(!localStorage.getItem('conversation')){
        const listMessages=await Usuario.sendMessage('hola',user.id);
        const dataPromises = listMessages.data.sendMessage.data.data.map(async (element) => {
        const data = {
            body: element.text,
            createdAt: new Date(),
            contentType: element.type
        }; 
            return data;
        });
        const dataResults = await Promise.all(dataPromises);
        conversation =[...conversation, dataResults];
        setMessages(messages.flat());
        localStorage.setItem('conversation',JSON.stringify(conversation.flat()));
    }
  };

  const handleClose = () => {
    setOpen(false);
    localStorage.removeItem('conversation');
  };

  const notDefault =
    themeMode !== defaultSettings.themeMode ||
    themeLayout !== defaultSettings.themeLayout ||
    themeStretch !== defaultSettings.themeStretch ||
    themeContrast !== defaultSettings.themeContrast ||
    themeDirection !== defaultSettings.themeDirection ||
    themeColorPresets !== defaultSettings.themeColorPresets;

  return (
    <>
      {!open && user && <ToggleButtonChat open={open} notDefault={notDefault} onToggle={handleToggle} />}
      <Dialog
        anchor="center"
        open={open}
        onClose={handleClose}
        BackdropProps={{ invisible: true }}
        PaperProps={{
          sx: {
            ...bgBlur({ color: theme.palette.background.default}),
            position:'fixed',
            bottom:0,
            right:0,
            height:500,
            width:400,
            backgroundColor:'#FFFFFF',
            whiteSpace:'pre-line'
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ py: 2, pr: 1, pl: SPACING, backgroundColor:'rgb(34, 197, 94)', height:55 }}
        >
          <Typography variant="subtitle1" sx={{ flexGrow: 1, color:'#FFFFFF' }}>
            Chat
          </Typography>

          <IconButton onClick={handleClose} sx={{ color:'#FFFFFF' }}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <ChatMessageList messages={conversation}/>

        <Box sx={{ p: SPACING, pt: 0 }}/>
          <ChatMessageInput
                onSend={handleSendMessage}/>
      </Dialog>
      
    </>
  );
}
