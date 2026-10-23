// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { node } from './node.js';

export function coreDagsDiagram() {
  return `<div class="core-dags-map">
    <section class="core-dags-delivery" data-scope="dag-delivery">
      <h3>Reviewed files reach the Airflow pods</h3>
      <div class="core-dags-input">
        <span class="group-label">Stack source · outside the workloads</span>
        ${node('dag-catalog', 'catalog.yaml', 'spi-smoke: Echo_DAG, airflow_monitoring<br>core-ingestion: Osdu_ingest, manifest_ingestion', 'artifact')}
      </div>
      <div class="core-dags-arrow">↓ full commit + per-file SHA-256 · only cataloged files</div>
      <div class="core-dags-boundary">
        <h4>AKS · platform namespace · Airflow pod startup</h4>
        ${node('dag-loader', 'load-osdu-dags', 'Init container on scheduler and processor · failure holds the new pod in init')}
        <div class="core-dags-arrow">↓ staged files + hash-locked Python libraries</div>
        ${node('dag-processor', 'DAG processor', 'Parses the staged files · no OSDU Workload Identity')}
        <p>The same loader stages files for the scheduler below. No git-sync, blob delivery, or custom Airflow image.</p>
      </div>
    </section>
    <section class="core-dags-registration" data-scope="dag-registration">
      <h3>Registration follows Airflow and init</h3>
      <div class="core-dags-boundary core-dags-nongating">
        <h4>AKS · platform namespace · separate Job</h4>
        ${node('dag-registration', 'spi-osdu-dag-registration', 'Layer 6 · non-gating · uses the OSDU identity')}
        <p>Exact declared DAG set, fresh parses, zero import errors. Register system workflows with Workflow; unpause declared IDs in Airflow. Pause removed IDs; never delete.</p>
        <p><b>Deployable is not ingestion proof.</b></p>
      </div>
    </section>
    <section class="core-dags-runtime" data-scope="dag-provenance">
      <h3>One ingestion run crosses three credentials</h3>
      <div class="core-dags-path">
        <div class="core-dags-actor core-dags-outside">
          <h4>Outside AKS · your workstation</h4>
          ${node('dag-caller', '1 · Caller', 'spi test dags --as me')}
          <div class="core-dags-edge">
            <span>↓ Caller → Workflow</span>
            ${node('dag-caller-token', 'Your token', 'Signed-in person', 'core-dags-credential')}
          </div>
        </div>
        <div class="core-dags-boundary">
          <h4>AKS · osdu namespace</h4>
          ${node('dag-workflow', '2 · OSDU Workflow API', 'Derives submittedBy and userId · rejects a supplied user ID')}
          <div class="core-dags-edge">
            <span>↓ Workflow → Airflow API</span>
            ${node('dag-airflow-login', 'osdu-workflow login', 'Airflow role User · no OSDU authority', 'core-dags-credential')}
          </div>
        </div>
        <div class="core-dags-boundary">
          <h4>AKS · platform namespace</h4>
          ${node('dag-airflow-api', '3 · Airflow API server', 'Accepts the run · no OSDU Workload Identity')}
          <div class="core-dags-arrow">↓ schedules work inside the scheduler</div>
        </div>
        <div class="core-dags-boundary">
          <h4>AKS · platform namespace · scheduler pod · LocalExecutor</h4>
          ${node('dag-task', '4 · Scheduler task', 'A process inside this pod, not a task pod · platform/workload-identity-sa')}
          <div class="core-dags-edge">
            <span>↓ Scheduler task → Storage</span>
            ${node('dag-osdu-identity', 'OSDU identity + on-behalf-of', 'Identity: users.datalake.delegation<br>Caller: users.datalake.impersonation', 'core-dags-credential')}
          </div>
        </div>
        <div class="core-dags-boundary">
          <h4>AKS · osdu namespace</h4>
          ${node('dag-storage', '5 · OSDU Storage API', 'Read back the submitted data · createUser must be the caller')}
          <p>Storage here is the OSDU API, not an Azure Storage account.</p>
        </div>
      </div>
    </section>
  </div>`;
}
