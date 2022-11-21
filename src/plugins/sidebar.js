import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import {
	PluginSidebar,
	PluginDocumentSettingPanel,
	PluginPostStatusInfo,
	PluginPostPublishPanel,
	PluginMoreMenuItem,
	PluginBlockSettingsMenuItem,
} from '@wordpress/edit-post';
import { useSelect, dispatch } from '@wordpress/data';
import {
	NavigableMenu,
	TabbableContainer,
	PanelBody,
	Button,
} from '@wordpress/components';

const Plugin = () => {
	return (
		<>
			<PluginPostPublishPanel title={__('My panel')}>
				{__(
					'This content will render after the user publishes a post.'
				)}
			</PluginPostPublishPanel>
			<PluginBlockSettingsMenuItem
				allowedBlocks={['core/paragraph']}
				label={__('This will only appear on the text-block.')}
				onClick={() => alert('clicked')}
			/>

			<PluginMoreMenuItem>
				{__(
					'Text will be added on the plugins section on the sidebar.'
				)}
			</PluginMoreMenuItem>
			<PluginPostStatusInfo title={__('My panel')}>
				{__(
					'This content will render in the Status & Visibility panel of the Document sidebar.'
				)}
			</PluginPostStatusInfo>
			<PluginDocumentSettingPanel
				title={__('My panel')}
				icon="admin-collapse"
			>
				{__('This content will get added to the general sidebar.')}
			</PluginDocumentSettingPanel>

			<PluginSidebar
				name="my-sidebar"
				title="My sidebar title"
				icon="smiley"
			>
				{__('This content will get added to a new general sidebar.')}
			</PluginSidebar>
		</>
	);
};

const useDispatch = dispatch('core/edit-post');

// Open the sidebar on load
// useDispatch.openGeneralSidebar('data-store-plugin/my-sidebar');

registerPlugin('data-store-plugin', {
	render: Plugin,
});
