import { Routes } from "@angular/router";
import {EvaluationQuestionnaireComponent} from './evaluation-questionnaire.component';

export default[
{
  path :':id',
  component: EvaluationQuestionnaireComponent,
}
] as Routes;