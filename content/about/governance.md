---
title: Governance
description: Learn about the governance structure of the Xen Project, including its goals, principles, decision-making processes, and roles. Discover how the project ensures transparency, openness, and meritocracy in its operations.
keywords: "Xen Project governance, open-source governance, Xen Project principles, Xen Project goals, Xen Project decision making, Xen Project roles, Xen Project sub-projects, Xen Project transparency, Xen Project meritocracy, Xen Project openness, Xen Project lifecycle, Xen Project community, Xen Project collaboration, Xen Project development, Xen Project teams"
date: 2024-01-14T07:07:07+01:00
draft: false
menus:
  main:
    parent: About
    weight: 40
---


{{<section md="true" container="small content-markdown">}}
## Goals

The goals of Xen Project Governance are to:

- Create a set of minimum requirements for a sub-project hosted on Xenproject.org
- Create a lightweight project life cycle that
  - leads the project to articulate its goals and how to achieve them
  - encourages desired behaviours (e.g. open development)
  - provides motivation for the project to succeed
  - leads to non-viable projects failing quickly
  - provides opportunities for other community members
- Avoid bureaucracy, i.e. the life cycle should be as informal as possible
- Encourage Xen related projects to be hosted on Xenproject.org rather than going elsewhere
- Set clear expectations to vendors, upstream and downstream projects and community members

## Principles

### Openness

The Xen Project is open to all and provides the same opportunity to all. Everyone participates with the same rules. There are no rules to exclude any potential contributors which include, of course, direct competitors in the marketplace.

### Transparency

Project discussions, minutes, deliberations, project plans, plans for new features, and other artefacts are open, public, and easily accessible.

### Meritocracy

The Xen Project is a meritocracy. The more you contribute the more responsibility you will earn. Leadership roles in Xen are also merit-based and earned by peer acclaim.

### Local Decision Making

The Xen Project consists of a number of sub-projects: each sub-project makes technical and other decisions that solely affect it locally.

## Xen Project Wide Roles

### Sub-projects and Teams

The Xen Project organizes itself into a number of sub-projects, which follow the [Project Governance](#project-governance) (or Project Lifecycle) as outlined in this document. Sub-projects (sometimes simply referred to as projects) are run by individuals and are often referred to as teams to highlight the collaborative nature of development. For example, each sub-project has a [team portal](/developers/teams) on Xenproject.org. Sub-projects own and are responsible for a collection of source repositories and other resources (e.g. test infrastructure, CI infrastructure, …), which we call **sub-project assets** (or team assets) in this document.

Sub-projects can either be **incubation projects** or **mature projects** as outlined in [Basic Project Life Cycle](#basic-project-life-cycle). In line with the meritocratic principle, mature projects have more influence than incubation projects, on [project wide decisions](#project-wide-decision-making).

### Community Manager

The Xen Project has a community manager, whose primary role it is to support the entire Xen Project Community.

### Xen Project Advisory Board

The [Xen Project Advisory Board](/join) consists of members who are committed to steering the project to advance its market and technical success, and who serve as positive ambassadors for the project. The Xen Project Advisory Board manages non-technical aspects of the Xen Project including funding for shared project infrastructure, marketing and events, and managing the Xen Project trademark. The Advisory Board leaves all technical decisions to the open source meritocracy.

### The Linux Foundation

The Xen Project is a [Linux Foundation](/linux-foundation) Collaborative Project. Collaborative Projects are independently funded software projects that harness the power of collaborative development to fuel innovation across industries and ecosystems. By spreading the collaborative DNA of the largest collaborative software development project in history, The Linux Foundation provides the essential collaborative and organizational framework so projects can focus on innovation and results.

### Mentor

Younger projects may have a need for a mentor to help ensure that the project will be successful. Mentors can be maintainers, project leads, advisory board members or other distinguished community members.

### Sponsor

To form a new sub-project or team on Xenproject.org, we require a sponsor to support the creation of the new project. A sponsor can be a member of the project leadership team of a mature project, a member of the advisory board or the community manager. This ensures that a distinguished community member supports the idea behind the project.

## Project Team Roles

Sub-projects or teams are driven by the people who volunteer for the job. This functions well for most cases. This section lists the main roles which projects use. This section lists the default roles, which are based on how the Hypervisor project operates. Sub-projects can deviate from the default, but are required to document deviations from the default and link to it from this [document](#per-sub-project-governance-specialisation). The only exception is that each project is required to have a project leadership team, as without it, the project will not be able to function.

The following table lists how each project uses these roles. Note that **incubation projects** have more flexibility in experimenting with roles that work for them, but need to define specializations before they can **mature**.

| Project             | Mature | Maintainers | Committers | Security Team | Leadership Team                                        |
| ------------------- | ------ | ----------- | ---------- | ------------- | ------------------------------------------------------ |
| **Hypervisor**      | YES    | YES         | YES        | YES           | Committers and Release Manager, without a Project Lead |
| **Windows Drivers** | NO     | YES         | YES        | NO            | Committers, with a Project Lead                        |
| **XAPI**            | YES    | YES         | YES        | NO            | Committers, with a Project Lead                        |

### Maintainers

Maintainers own one or several components in the sub-projects source tree(s). A maintainer reviews and approves changes that affect their components. It is a maintainer's prime responsibility to review, comment on, co-ordinate and accept patches from other community member's and to maintain the design cohesion of their components. Maintainers are listed in a MAINTAINERS file in the root of each code repository that the project owns.

Larger sub-projects such as the Hypervisor may have special maintainer roles such as a release manager and stable branch maintainers. In addition, larger projects may award different maintainers different levels of influence. Any specialisations and implications are documented in the respective MAINTAINERS file.

### Committers

Committers are Maintainers that are allowed to commit changes into the source code repository. The committer acts on the wishes of the maintainers and applies changes that have been approved by the respective maintainer(s) to the source tree. Due to their status in the community, committers can also act as referees should disagreements amongst maintainers arise. Committers are listed on the sub-project's team portal (e.g. [Hypervisor team portal](/developers/teams/hypervisor)) and/or in the projects MAINTAINERS files.

### Security Response Team (short: Security Team)

Each sub-project may have a security response team, that is responsible for receiving, reviewing, and responding to security incident reports for the sub-projects assets according to its security response process (e.g. [Hypervisor Security Problem Response Process](/developers/security-policy)).

### Project Leadership Team and Project Lead

Sub-projects and teams hosted on Xenproject.org are managed by a Project Leadership Team. The leadership team is made up of distinguished community members, but the exact composition may depend on the sub-project. For example, in the case of the Hypervisor sub-project, all committers and the release manager, are part of the leadership team. The leadership team owns the sub-projects processes, the overall architecture and all assets within the project and makes [sub-project wide decisions](#leadership-team-decisions) on behalf of its community.

A sub-projects leadership team members are listed on the sub-project's team portal (e.g. [Hypervisor team portal](/developers/teams/hypervisor)).

The Leadership Team may elect a Project Lead who is also a member of the Leadership Team. Project Leads are the public figurehead of the project and are responsible for the health of the project. Project Leads can also act as [referees](#conflict-resolution) should the Project Leadership Team become paralysed.

## Making Contributions

Making contributions in Xen follows the conventions as they are known in the Linux Kernel community. In summary contributions are made through patches that are reviewed by the community. Xen does not require community members to sign contribution or committer agreements. We do require contributors to sign contributions using the sign-off feature of the code repository, following the same approach as the Linux Kernel does (see [Developer Certificate Of Origin](http://elinux.org/Developer_Certificate_Of_Origin)).

More information on making contributions can be found in the following documents:

- [Contribution Guidelines](/help/contribution-guidelines)
- [Review Then Commit Policy](#review-then-commit)

## Decision Making, Conflict Resolution, Role Nominations and Elections

Sub-projects or teams hosted on Xenproject.org are normally auto-governing and driven by the people who volunteer for the job. This functions well for most cases. This section lists the main mechanisms by which projects make decisions. This section lists the default mode of operation, which is based on how the Hypervisor project operates. Sub-projects can deviate from the default, but are required to document deviations from the default and link to it from this [document](#per-sub-project-governance-specialisation). The only exception is that each project is required to adhere to the **Review Then Commit Policy**, **Leadership Team Decisions** and **Conflict Resolution**.

### Review Then Commit

The vast majority of technical decisions within the Xen Project are code related decisions (e.g. patches and design documents), which determine whether a specific change can be accepted into the code base. The default decision making process is a review and commit process, which requires that all changes receive explicit approval from respective code owners (maintainers) before they are committed. The exact workflow and details of this policy between sub-projects may differ and are documented in one or several of the following places: MAINTAINERS/README/CONTRIBUTING files in repositories and/or the sub-project team portal.

### Expressing Agreement and Disagreement

Within the community, we follow the following number notation to explicitly express opinions on proposals, formal or informal votes.

- **+2** : I am happy with this proposal, and I will argue for it
- **+1** : I am happy with this proposal, but will not argue for it
- **0** : I have no opinion
- **\-1** : I am not happy with this proposal, but will not argue against it
- **\-2** : I am not happy with this proposal, and I will argue against it

A **\-2** should include an alternative proposal or a detailed explanation of the reasons for the negative opinion. A **+2** should include reasons for the positive opinion.

How we tally results and their implications depend on the context in which is is used and are marked with Passed/Failed: in one of the following sections:

- [Lazy Consensus / Lazy Voting](#lazy-consensus--lazy-voting)
- [Leadership Team Decisions](#leadership-team-decisions)
- [Project Wide Decision Making](#project-wide-decision-making)

### Lazy Consensus / Lazy Voting

Lazy Consensus is a useful technique to make decisions for specific proposals which are not covered by the Review Then Commit Policy or do not require a more formal decision (see below). Lazy Consensus is extremely useful, when you don't anticipate any objections, or to gauge whether there are objections to a proposal. The concrete process in this section is a mixture between Lazy Consensus and Lazy Voting and is designed to avoid unnecessary multiple stages in decision making.

To make use of it, post something like the following on the project's mailing list (or some other communication channel):

```
I am assuming we are agreed on X and am going to assume lazy consensus:
if there are no objections within the next seven days.
```

You should however ensure that all relevant stake-holders which may object are explicitly CC'ed, such as relevant maintainers or committers, ensure that **lazy consensus** is in the body of your message (this helps set up mail filters) and choose a reasonable time-frame. If it is unclear who the relevant stake-holders are, the project leadership can nominate a group of stake-holders to decide, or may choose to own the decision collectively and resolve it.

Objections by stake-holders should be expressed using the [conventions above](#expressing-agreement-and-disagreement) to make disagreements easily identifiable.

**Passed/Failed:** The proposer of Lazy Consensus decision is assumed to implicitly have an opinion of **+1**, unless otherwise stated.

- Failed: A single **\-2** by a stake-holder whose approval is necessary
- Failed: A total sum of opinions **<=0**
- Passed: A total sum of opinions **\>0**

It can only be overturned if the project leadership agrees collectively, that the decision is too important to be settled by lazy consensus / lazy voting. In situations where a proposal is failed, an alternative solution needs to be found, or if a decision is formally challenged, [conflict resolution mechanisms](#conflict-resolution) may need to be used to resolve the situation.

**Further Examples:** A Lazy Consensus decision starts out with the implicit **+1** opinion of the proposer. If there is no explicit response, the proposal passes as the sum is **\>0**.

If there is a single **\-1** without any **+** votes, the proposal fails.

If there are multiple **+1**'s or **+2**'s, more **\-1**'s than positive votes are needed for the proposal to fail. This mechanism, is often also called

**Lazy Voting**.

The process does allow for a proposer to state a starting opinion of **0** or **\-1**. In this case, the Lazy Consensus label does not work for the process, as positive opinions are needed for the proposal to pass. To make use of this mechanism, post something like the following on the project's mailing list (or some other communication channel)

```
I want to solicit opinions on X and am going to assume lazy voting:
My starting position is 0, as I feel that at least one other stake-holder
should agree with the proposal.If there is a majority in favour, without a
-2 objection within the next seven days, I assume that the proposal holds and
does not need require further discussion.
```

Unlike in the lazy consensus case, a single **+1** vote is needed. Otherwise the proposal fails. Otherwise, the counting rules follow the general case.

This can be useful in situations, where the proposer is not quite sure about his/her position, or where the invoker acts on behalf of the community to resolve a discussion which has become stuck. A starting position of **\-1** can be used to verify that a specific approach may be a bad idea: whether this is really useful, has to be verified as we start using this process.

### Informal Votes or Surveys

Generally the Xen Project community tries to achieve consensus on most issues. In situations where several concrete options are possible, community members may organize an informal vote on the different proposals and use the [conventions above](#expressingopinion) to identify the strongest proposal. Once the strongest candidate has been identified, [lazy consensus](#lazyconsensus) could be used to close the discussion. In some situation, a specific survey may need to be created, to help identify gauging consensus on specific issues. For informal votes and surveys, we do not prescribe specific rules, as they are non-binding: it is up to the organizer of an informal vote or survey to interpret the result and explain it to the community. If the vote/survey relates to an area that is owned by the project leadership, the project leadership has to formally confirm the decision.

Note that informal votes amongst a small set of stake-holders that disagree on a position during technical disagreements in code, design reviews and other discussions can be useful. In technical discussions it is not always clear how strong agreement or disagreement on a specific issue is. Using the [conventions above](#expressingopinion), can help differentiate between minor and major disagreements and reduce the time a discussions continues unnecessarily. This is true in particular for cases, where several maintainers may need to agree to a proposal.

When having an informal vote or survey, they creator should consider whether conducting a vote or survey in public, may be divisive and damaging for the community. In such cases, the vote/survey should be conducted anonymously.

### Leadership Team Decisions

Each sub-project has a leadership team, which is typically made up of the most senior and influential developers within the sub-project (e.g. the project’s committers). The project leadership team owns decisions, such as:

- Sub-project wide policy decisions (e.g. policies, procedures and processes whose scope is specific to the sub-projects). This includes deviations from project global governance, where permissible.
- Decisions related to sub-project assets that are not clearly owned (e.g. unowned code, project wide assets such as test infrastructure, etc.).
- Decisions related to nominating and confirming leadership roles within the sub-project. This includes [decisions to creating and filling specialised new roles](#elections), such as release managers or similar, including their scope and set of responsibilities.
- Resolving [conflicts](#conflict) within the sub-project that cannot otherwise be resolved.

Leadership team decisions can be made in private (e.g. a private IRC meeting, on a private mailing list, through a private vote) or on a public mailing list using [decision making conventions](#expressingopinion). If a decision is made in private, the outcome must be summarized in terms of number of votes in favour or against on a public mailing list. Decisions should **not** generally be made in an anonymous vote, unless there is a good reason to do so. For example, if the decision may be divisive and damage the cohesion of the leadership team, an anonymous vote is preferred. In such cases, the leadership team, can ask the community manager, to arrange an anonymous vote on behalf of the leadership team.

Decisions (also called Resolutions) require a **2/3rd** majority amongst active leadership team members in favour of a proposal. The tallying of votes follows the rules outlined below. Note that a minimum of 3 leadership team members is needed for a [leadership team to function](#exceptional-circumstances).

Leadership team decisions normally have to be made actively: in other words each team member has to cast a vote **explicitly** expressing their opinion. The only exception are face-2-face or on-line meetings with a quorum of **2/3rd** of active leadership team members present at the meeting: in such cases a meeting chair is required who calls for decision on a resolution and asks for objections. This allows to conduct meetings more quickly.

**Passed/Failed Resolutions:**

Voting is conducted in line with the following rules:

- Project leadership team members vote for (**+1**) or against (**\-1**) a resolution. There is no differentiation between **+1**/ **+2** and **\-1**/**\-2**: in other words a **+2** is counted as a vote for, a **\-2** as a vote against the resolution. The number of votes for and against a resolution is called **active vote**. **0** votes **are not counted** as an active vote.
- A **quorum of at least 1/3 of positive votes for a proposal** is required for a resolution to pass. In other words, if the leadership team has 7 members, at least 3 members need to vote for the resolution.
- The resolution passes, if a 2/3 majority of active votes is in favour of it.

The table below maps the number of leadership team members against the required quorum:

|                                      |     |     |     |     |     |     |     |     |     |
| ------------------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Leadership team members**          | 10  | 9   | 8   | 7   | 6   | 5   | 4   | 3   | 2   |
| **Positive votes needed for quorum** | 4   | 3   | 3   | 3   | 2   | 2   | 2   | 1   | 1   |

The table below maps active votes against votes needed to pass:

|                                   |     |     |     |     |     |     |     |     |     |
| --------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Active Votes (+1 or -1)**       | 10  | 9   | 8   | 7   | 6   | 5   | 4   | 3   | 2   |
| **Positive votes needed to pass** | 7   | 6   | 6   | 5   | 4   | 4   | 3   | 2   | 2   |

### Conflict Resolution

Sub-projects and teams hosted on Xenproject.org are not democracies but meritocracies. In situations where there is disagreement on issues related to the day-to-day running of the project, the [project leadership team](#leadership) is expected to act as referee and make a decision on behalf of the community. Projects leadership teams can choose to delegate entire classes of conflict resolution issues to community members and/or the project lead (e.g. the project can choose to delegate refereeing on committer disagreements to the project lead; or it could choose a specific committer to always act as referee amongst a group of committers). Any such delegation needs to be approved as normal and has to be documented.

Should a project leadership team become dysfunctional or paralysed, the project leadership team or project lead should work with the community manager or advisory board to find a way forward.

In situations where the entire Xen Project community becomes paralysed the impacted project leadership teams or project leads should work with the community manager or advisory board to find a way forward.

### Elections

#### Maintainer Elections

Developers who have earned the trust of existing maintainers can be promoted to maintainer. A two stage mechanism is used

- Nomination: A maintainer should nominate himself by proposing a patch to the MAINTAINERS file or mailing a nomination to the project’s mailing list. Alternatively another maintainer may nominate a community member. A nomination should explain the contributions of proposed maintainer to the project as well as a scope (set of owned components). Where the case is not obvious, evidence such as specific patches and other evidence supporting the nomination should be cited.
- Confirmation: Normally, there is no need for a direct election to confirm a new maintainer. Discussion should happen on the mailing list using the normal decision making process. If there is disagreement or doubt, the decision is handled by the project leadership.

#### Committer and other Project Leadership Elections

Developers who have earned the trust of committers in their project can through election be promoted to Committer or Project Leadership (if not covered otherwise). A two stage mechanism is used

- Nomination: Community members should nominate candidates by posting a proposal to _appointments at xenproject dot org_ explaining the candidate’s contributions to the project and thus why they should be elected to become a Committer of the project. The nomination should cite evidence such as patches and other contributions where the case is not obvious. Existing Committers will review all proposals, check whether the nominee would be willing to accept the nomination and publish suitable nominations on the project’s public mailing list for wider community input.
- Election: A committer will be elected using the decision making process outlined earlier. In other words, the decision is delegated to the [project leadership team](#leadership).

#### Security Response Team Members

Developers who have earned the trust of other security team members can be promoted to be on the security team. Due to the specific needs of the security team, promotions are typically made by the security team itself and confirmed by lazy consensus within the team.

#### Project Lead Elections

Projects which have a project lead, should vote for a project lead in an anonymous vote amongst the project leadership.

### Project Wide Decision Making

Project wide decisions are made through **formal global votes** and are conducted in rare circumstances only, following the principle of [local decision making](#principles). Global votes are only needed, when all sub-projects hosted on Xenproject.org are affected. This is true, only for:

- Specific votes on creating, graduating, completing/archiving of sub-projects as outlined in [project governance](#project-governance).
- Changes to this document, where sub-projects cannot specialise. In particular the sections: [goals](#goals), [principles](#principles), [project wide decision making](#project-decisions) and [project governance](#project-governance) (and small parts of [Xen Project wide roles](#roles-global), [project team roles](#roles-local) and [decision making](#decisions) that are needed for project governance or **apply to all sub-projects** as stated in those sections).
- Changes to this document where sub-projects can specialise require at least one mature project other than the Hypervisor project to be impacted significantly by the change. The sections in question, are [project team roles](#roles-local) and [decision making](#decisions). These sections define the **gold standard** of how the original Hypervisor Project operates. In other cases, the Hypervisor project leadership team can agree changes to these sections, as they are essentially reference definitions. Other sub-projects have to be consulted, and have to be given time to adapt to changes.
- Changes to existing global namespace policies (e.g. [Mailing List Conventions](/help/mailing-list/mailing-list-conventions/)) and creation of new project wide namespace policies.
- Changes to the boundary of what policies are project local and global decision: e.g. a decision to introduce a global Security Vulnerability Response Process that affects all sub-projects.

Global votes are arranged by the community manager when needed (e.g. for a project review or a global process change). Who exactly has input on a proposal and can vote on it, depends on the type of change as outlined below:

| **Proposal**                                               | **Who reviews?**                                          | **Who votes?**                                                                                                                                                                                         |
| ---------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Creating, graduating, completing/archiving of sub-projects | Members of developer mailing lists of qualifying projects | Leadership teams of **mature** sub-projects, with the exception of the project which is being reviewed (e.g. for an archivation review, the leadership team of the project under review, cannot vote). |
| Global Process Changes                                     | Members of developer mailing lists of qualifying projects | Leadership teams of **mature** sub-projects, within the scope described above.                                                                                                                         |

The community manager first arranges a public review, followed by a timed private vote. Public review and voting should be open for a minimum of a week each. For voting a traceable poll mechanism (e.g. voting form that keeps auditable and tamper proof records) must be used.

Voting is conducted **per project** in line with the following rules:

- Each qualifying project’s vote is counted per project and then aggregated as outlined below.
- Project leadership team members vote for or against a proposal (there is no differentiation between **\-1**/**\-2** and **+1**/**+2**). A **0** vote is not counted as a valid vote.
- A **quorum of at least least 1/3 of positive votes** of each project’s leadership team members is required. In other words: if a project’s leadership team does not achieve the quorum, the entire sub-project’s vote is not counted. This avoids situations where only a minority of leadership team members vote, which would skew the overall result. If it becomes clear, that a sub-project is not likely to meet the quorum, the voting deadline can be extended by the community manager.

**Passed/Failed Resolutions:**

- If none of the qualifying projects achieve a quorum, the change cannot hold. In that case, we consider that there is not enough momentum behind a change.
- For each qualifying project with a quorum, the percentage of votes in favour and against is calculated (e.g. if 5 people voted in favour, 2 against and 1 abstains, the share is 5/7th and 2/7th respectively).
- Votes in favour are averaged as percentages across all projects (say we have per project figures of 50%, 80%, 70% in favour, then the total vote in favour is 66.67%).
- If the total vote achieves a 2/3rd majority in favour, the proposal passes. Otherwise it fails.

## Community Decisions with Funding and Legal Implications

In some cases sub-project local and global decisions **may require input** from the [Advisory Board](#roles-ab) and/or the \[Linux Foundation\] (#roles-lf). For example, if a proposal by a project leadership team or a global project decision requires that the project hires a staff member or contractor (e.g. a PR consultant, marketing manager) or requires the funding of new infrastructure (e.g. additional test hardware or services) to implement said proposal, then funding would need to be secured from the Advisory Board or from other sources.

If for example, a community proposal required the Linux Foundation to sign a legal agreement with a 3rd party on behalf of the project/sub-project, then of course a review of such an agreement and a signature by the Linux Foundation would be required.

In such cases, the impacted project leadership team(s) will contact the Community Manager and/or Advisory Board to resolve possible issues.

## Project Governance

### Basic Project Life Cycle

The proposal is to follow a simple basic flow:

{{<center>}}
![](/img/others/governance-xen_projectstages.webp)
{{</center>}}

A Xenproject.org hosted project starts with an idea which through the process of project formation will grow into a project proposal. The project proposal will need to satisfy some basic conditions, will be put out for community review and is then put to a vote to all maintainers and project leads of mature sub-projects hosted on Xenproject.org following the usual decision making process.

For agreed project proposals, the Xen Project will provide basic infrastructure and the project can get started. Sub-projects in incubation are working towards a set of goals, will get additional support and marketing opportunities from the Xen Project. However there will also be regular checkpoints to see whether the project is progressing. Should it turn out that a project is not viable any more, it will be archived after an archivation review and vote. For a project to graduate, some basic conditions must be satisfied. If a project in incubation has achieved the point where it believes it is mature enough to graduate, it can request a Graduation community review followed by a vote.

Mature projects are pretty much expected to run themselves. However at some point a mature project will lose momentum and developers. If this is the case the Xen Project community can request an archivation review, which follows the usual pattern.

Archivation reviews have two purposes:

- give somebody in the community an opportunity to step up and continue a project,
- archive the project outcomes such that they are still available to people who want to use them, but promotion of such projects will cease.

It is also possible to revive archived projects. However these are treated almost like new projects as projects would only be archived if they have become inactive.

### Requesting Reviews, Reviews and Voting

**Requesting Reviews:** Project Proposal and Graduation Reviews are requested by the (prospective) project lead of the project by contacting the community manager providing the necessary documentation. An archivation review can be requested by any maintainer of a mature project or by the Xen Project community manager. The community manager will then publish relevant material on the respective mailing lists.

**Reviews:** These are off-line reviews which are open to all community members by which a proposal is published for review. The purpose of the review is two-fold:

- gather final feedback and input from the community (it is good practice to informally do this before the review),
- advertise the project with the aim to attract interest, users and contributors.

After a review, the requester of the review may decide to withdraw, request a re-review or progress to a vote by arranging with the community manager.

**Voting:** The community manager arranges a timed private vote as outlined in [Formal Votes](#project-decisions).

### Forming a Project

Requirements for forming a sub-project or team on Xenproject.org:

- A project needs a lead, who is willing to become the project lead of the sub-project
- A project needs a sponsor, which can be a project lead of a mature project, a member of the Xen Project Advisory Board or the community manager
- There should be no dissent from other community members who would qualify as sponsor (see “Principle: Consensus Decision Making”)
- A project needs a mentor, which can be the project sponsor or a maintainer of a mature project
- A project needs to have a relationship to other sub-projects or teams, i.e. it aims to develop software that has a dependency on other sub-projects or teams hosted on Xenproject.org. If the project needs components in other sub-projects to work, then this should also be stated.
- A project needs to be large and long-term enough to grant a separate project. For example adding support for a new CPU architecture, adding additional functionality on top of existing projects, etc. Adding a new feature to an existing project should be performed within an existing project.
- A project will deliver code using a license that is compatible with other sub-projects hosted on Xenproject.org (ideally GPLv2).

The purpose of the project formation phase is to work out what the project is about, get community buy-in and help the future project gain publicity and momentum. The formation phase is driven by the project lead. The project mentor’s role is to advise and support the project lead in getting the project started.

The project proposal is a document that describes and is published on [wiki.xenproject.org](http://wiki.xenproject.org):

- What the project is aiming to achieve (i.e. the project charter and project goals)
- What components/code and in which code lines (new or components in other projects) the project aims to deliver
- Key dependencies on other sub-projects or teams hosted on Xenproject.org (if applicable)
- Lists initial maintainers (if applicable)
- Lists any interested parties in the project (if applicable)
- Lists any planned initial code contributions (if applicable)
- A rough plan on how to get through the Incubation phase

### Project Proposal Review

The review is initiated by the project lead and follows the rules outlined in “Requesting Reviews, Reviews and Voting”.

After a successful review, the following resources will be created for the project:

- A mailing list
- A codeline
- A sub-project or team portal on Xenproject.org (in an area separate from mature projects)
- A wiki page on [wiki.xenproject.org](http://wiki.xenproject.org) (this is expected to be maintained by the project lead)

### Incubating a Project

The purpose of the incubation phase is for a project to show that it is gathering momentum and adheres to the “Principles & Roles” of sub-projects hosted on Xenproject.org. The project mentor will work closely with the project lead and there are at least quarterly informal review meetings with the mentor on how the project is doing. Should a mentor not be able to fulfil his/her role any more, it is the responsibility of the project lead to find another mentor. We advise that the project lead gives at least quarterly updates on the Xen Project blog on how the project is doing.

The Xen Project will provide support to incubating projects. The project lead will work closely with the Xen Project community manager as well as with the project mentor.

### Archiving an Incubating project

The mentor can request for a project to be archived, if the project is not making sufficient progress. See “archivation review”.

### Graduation Review

The review is initiated by the project lead and follows the rules outlined in “Requesting Reviews, Reviews and Voting”. In essence the project lead makes a pitch to the community, why the project should graduate.

A project must fulfil the following requirements before it can graduate:

- It follows the principles of openness, transparency and meritocracy
- It has delivered at least one functioning release of what it is aiming to deliver
- It has a public code line which shows active development and has mechanisms to accept patches (and a history of accepting patches)
- It has a public mailing list that is active (as we get more experience we will add some guidelines)
- It has a mechanism for users to raise bugs and for developers to work on bugs
- It has an active developer community (as we get more experience we will add some guidelines). But things to look for are number of maintainers, different organisations involved, number of users, etc.
- It has a project leadership team that resolves conflicts and participates in cross-project decision making
- It adheres to the Xen Project governance as outlined in this document, or documents areas where the sub-project differs

Other items to look at during the review (depending on project are):

- It has an up-to-date wiki and a core and group of people maintaining it
- It publishes regular builds and tests
- It promotes itself at events and on the blog

### Mature Projects

Mature projects are expected to be run and promote themselves. The project leadership team and/or project lead has significant responsibility in ensuring that this happens. The Xen Project and the community manager will help organize events, provide opportunities for the project to get new contributors and build a community, promote new releases on the blog and to the press, work with project members, etc. However the Xen Project and the community manager will not get involved in the day-to-day running of the project.

At some point during its life cycle a project may lose momentum. In other words developers and users are not interested in the project any more. If this is the case, it may be time to archive the project. If the project has achieved its goals and is thus completed, it may also be time to archive the project.

### Archivation Review

These can happen in a number of situations:

- An incubation project shows clear signs of failing and not progressing
- A mature project has lost its developer and user base (and there is little or no activity)
- The project has achieved its goals and/or fulfilled its charter: in other words it has completed

In the first case the review is triggered by the incubation project’s mentor. Failing this the review can be requested by any maintainer of a mature project (including the project’s lead) or by the Xen Project community manager. See “Requesting Reviews, Reviews and Voting”.

The review is essentially a pitch why the project should be archived. The purpose of the review is not necessarily to archive a project, but also to provide a last opportunity for interested parties in the Xen Project community to save the project and step up. The Xen Project community manager will support efforts to save the project, should community members want to step up. There is the special case that a project has been completed: in this case the normal situation would be for the project lead to make the case, why this is so.

### Archived Projects

When a project is archived the following happens:

- The codeline and mailing list will be made read-only and made accessible from an archived projects section on Xenproject.org
- The project’s wiki pages will be tagged as **archived**. A project may be completed (i.e. it has achieved its goals and/or fulfilled its charter) in which case it is tagged as **completed** and **archived**.
- The project or team portal on Xenproject.org will be moved into an **Archive** section. We may have a **Completed** section within the **Archive** section.

In cases where the project has delivered code into other sub-projects hosted on Xenproject.org, the code will be

- Deprecated at the point where the project is archived
- The project which now contains the archived code can (but does not have to) remove the code in a subsequent release (it should however give users sufficient time to adapt)

### Exceptional Circumstances

#### Incubation Projects without Project Lead

Projects which lose their project lead during the incubation phase, and do not have a working project leadership team, are at risk of failing. Should this occur, the project’s maintainer or committer community should nominate a new project lead and follow the election process as outlined in [elections](#elections).

If a project lead leaves during the formation phase, without finding a successor we assume that the project does not have enough momentum and will consider archiving the project.

#### Projects without functional Project Leadership Team

Projects which lose their project leadership team, or whose project leadership team is too small to function, are at risk of failing. A project leadership team should be of sufficient size to manage the project. Should this occur, the project’s maintainer or committer community should nominate new leadership team members and follow the election process as outlined in [elections](#elections).

If the community cannot create a functional leadership team, we assume that the project does not have enough momentum and will consider archiving the project.

#### Incubation projects without Mentor

Should an incubation project lose its mentor, the Xen Project community manager will support the project lead in finding a new mentor.

## Per Sub-Project Governance Specialisation

Add specialisations to this section, as they surface.

## Change History

- **v3.0 December 2016:** Refactored document. Otherwise significant changes to decision making, in the following areas
  - Added Goal: Local Decision Making
  - Split roles into project wide and sub-project specific roles
  - Added new roles: Community Manager, Security Response Team, Leadership Team
  - Added RTC Policy
  - Added +2 … -2 scheme for expressing opinions more clearly
  - Clarified lazy consensus / lazy voting with examples
  - Added Informal Votes or Surveys
  - Added Project Team Leadership decisions (majority vote, non-monotonicity)
  - Clarified and Adapted Conflict Resolution to previous changes
  - Updated Elections to cover new roles and terminology
  - Changed Project Wide Decision making (per project, non-monotonicity)
  - Changed Project Wide Decision making.
  - Clarified scope of Decision making
  - Added section on Community Decisions with Funding and Legal Implications
  - Modified all other sections which have dependencies on changes above
  - Added Per Sub-Project Governance Specialisation
- **v2.1 May 2016:** Clarify Committer Elections as per this [discussion](https://lists.xenproject.org/archives/html/xen-devel/2016-05/msg00801.html) and [vote](https://lists.xenproject.org/archives/html/xen-devel/2016-05/msg01614.html)
- **v2.0 May 2012:** Changes to reflect transition from xen.org to xenproject.org
  - Added definitions for Sub-projects and Teams, Xen Project Advisory Board and The Linux Foundation.
  - Removed Xen.org Chairman as Referee of Last Resort and delegated this role to the Xen Project Advisory Board.
  - Allow Xen Project Advisory Board members to be Mentors.
  - Clarify scope and eligible votes in Formal Votes; refer to this section from Requesting Reviews, Reviews and Voting rather than duplicating
  - Rename xen.org to xenproject.org or Xen Project throughout the document (except in the history)
  - Refer to sub-projects and teams instead of projects where appropriate
- **[v1.2](index.php?option=com_content&view=archive&year=2013&month=3) May 2012:** Minor changes
  - Fixed typo and ambiguity in the role of Project Lead.
  - Added section on Conflict Resolution.
- **v1.1 Oct 2011:** Minor changes
  - Clarified the roles of Committer and Maintainer.
  - Added Making Contributions which contains links to other documentation and highlights that Xen.org required a DCO for contributions since 2005.
  - **v1.0 Jun 2011:** Initial document approved

## Code of Conduct

The Xen Project is committed to making participation in our community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.  Please review the Code of Conduct [here](http://xenbits.xenproject.org/governance/code-of-conduct.html).

{{</section>}}