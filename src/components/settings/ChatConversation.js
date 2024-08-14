import PropTypes from 'prop-types';
import ThemeContrast from './ThemeContrast';
import ThemeRtlLayout from './ThemeRtlLayout';
import ThemeColorPresets from './ThemeColorPresets';
import  ChatDrawer  from './drawer/ChatDrawer';

// ----------------------------------------------------------------------

ChatConversation.propTypes = {
  children: PropTypes.node,
};

export default function ChatConversation({ children }) {
  return (
    <ThemeColorPresets>
      <ThemeContrast>
        <ThemeRtlLayout>
          {children}
          <ChatDrawer />
        </ThemeRtlLayout>
      </ThemeContrast>
    </ThemeColorPresets>
  );
}
