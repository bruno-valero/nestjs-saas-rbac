import Entity from '@core/entities/entity'
import UniqueEntityId from '@core/entities/unique-entity-id'

interface OrgBillingProps {
  seats: {
    amount: number
    unit: number
  }
  projects: {
    amount: number
    unit: number
  }
}

type OrgBillingCreationProps = {
  seatsAmount: number
  projectsAmount: number
}

export class OrgBilling extends Entity<OrgBillingProps> {
  static create(props: OrgBillingCreationProps, id?: string): OrgBilling {
    const billing = new OrgBilling(
      {
        ...props,
        seats: {
          amount: props.seatsAmount,
          unit: 10,
        },
        projects: {
          amount: props.projectsAmount,
          unit: 20,
        },
      },
      new UniqueEntityId(id),
    )

    return billing
  }

  get seats() {
    return {
      ...this.props.seats,
      price: this.props.seats.amount * this.props.seats.unit,
    }
  }

  get projects() {
    return {
      ...this.props.projects,
      price: this.props.projects.amount * this.props.projects.unit,
    }
  }

  get total() {
    return this.seats.price + this.projects.price
  }

  toObject() {
    return {
      id: this.id.value,
      seats: {
        amount: this.seats.amount,
        unit: this.seats.unit,
        price: this.seats.price,
      },
      projects: {
        amount: this.projects.amount,
        unit: this.projects.unit,
        price: this.projects.price,
      },
      total: this.total,
    }
  }

  toJSON(ident?: number) {
    const json = JSON.stringify(this.toObject(), null, ident)
    return json
  }
}
