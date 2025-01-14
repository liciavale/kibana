/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { FormEvent } from 'react';

import { useActions, useValues } from 'kea';

import { EuiButton, EuiFieldText, EuiFlexGroup, EuiFlexItem, EuiFormRow } from '@elastic/eui';

import { WorkplaceSearchPageTemplate } from '../../../components/layout';
import { ContentSection } from '../../../components/shared/content_section';
import {
  NAV,
  CUSTOMIZE_HEADER_TITLE,
  CUSTOMIZE_HEADER_DESCRIPTION,
  CUSTOMIZE_NAME_LABEL,
  CUSTOMIZE_NAME_BUTTON,
} from '../../../constants';
import { SettingsLogic } from '../settings_logic';

export const Customize: React.FC = () => {
  const { onOrgNameInputChange, updateOrgName } = useActions(SettingsLogic);
  const { orgNameInputValue } = useValues(SettingsLogic);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateOrgName();
  };

  return (
    <WorkplaceSearchPageTemplate
      pageChrome={[NAV.SETTINGS]}
      pageHeader={{
        pageTitle: CUSTOMIZE_HEADER_TITLE,
        description: CUSTOMIZE_HEADER_DESCRIPTION,
      }}
    >
      <form onSubmit={handleSubmit}>
        <ContentSection>
          <EuiFormRow label={CUSTOMIZE_NAME_LABEL} fullWidth isInvalid={false}>
            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiFieldText
                  isInvalid={false}
                  required
                  value={orgNameInputValue}
                  aria-label={CUSTOMIZE_NAME_LABEL}
                  data-test-subj="OrgNameInput"
                  onChange={(e) => onOrgNameInputChange(e.target.value)}
                />
              </EuiFlexItem>
              <EuiFlexItem />
            </EuiFlexGroup>
          </EuiFormRow>
          <EuiFormRow>
            <EuiButton color="primary" data-test-subj="SaveOrgNameButton" type="submit">
              {CUSTOMIZE_NAME_BUTTON}
            </EuiButton>
          </EuiFormRow>
        </ContentSection>
      </form>
    </WorkplaceSearchPageTemplate>
  );
};
